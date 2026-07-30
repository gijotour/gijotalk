import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // 본문 크기 제한.
  //
  // 대부분의 요청은 짧은 프롬프트뿐이라 16kb 로 조입니다. OCR 만 사진(base64)을
  // 받으므로 예외입니다. 전역 파서를 먼저 통과시키면 그 시점에 이미 413 으로
  // 잘려서 라우트 레벨 파서까지 오지도 못하므로, 여기서 경로를 갈라줘야 합니다.
  const OCR_PATH = "/api/gemini/ocr";
  const jsonSmall = express.json({ limit: "16kb" });
  const jsonForImages = express.json({ limit: "8mb" });

  app.use((req, res, next) => {
    if (req.path === OCR_PATH) return next();
    return jsonSmall(req, res, next);
  });

  /* ---------------------------------------------------------------- */
  /* 접근 코드                                                          */
  /* ---------------------------------------------------------------- */
  //
  // 지인 배포라 로그인은 과합니다. 다만 링크가 유출되면 Gemini 호출 비용이
  // 무제한으로 새므로, AI 엔드포인트에만 공유 코드를 겁니다.
  // 정적 앱 자체는 공개로 둡니다 — PWA 설치와 서비스 워커가 깔끔하게 동작해야 하고,
  // 회화 문장은 노출돼도 문제가 없습니다.
  //
  //   APP_ACCESS_CODE 를 설정하지 않으면 검사를 건너뜁니다(로컬 개발용).
  //   친구에게는 https://앱주소/?key=<코드> 형태로 링크를 보내면 됩니다.
  const ACCESS_CODE = process.env.APP_ACCESS_CODE || '';

  const requireAccessCode: express.RequestHandler = (req, res, next) => {
    if (!ACCESS_CODE) return next();
    const provided = req.header('x-gijo-key') || '';
    if (provided !== ACCESS_CODE) {
      return res.status(401).json({
        error: '접근 코드가 필요합니다. 받으신 링크(?key=...)로 다시 접속해 주세요.',
      });
    }
    next();
  };

  /* ---------------------------------------------------------------- */
  /* 레이트 리밋 (인메모리)                                              */
  /* ---------------------------------------------------------------- */
  //
  // 수십 명 규모라 외부 저장소 없이 프로세스 메모리로 충분합니다.
  const WINDOW_MS = 60_000;
  const MAX_PER_WINDOW = 10;
  const hits = new Map<string, number[]>();

  const rateLimit: express.RequestHandler = (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);

    if (recent.length >= MAX_PER_WINDOW) {
      return res.status(429).json({
        error: '요청이 너무 잦습니다. 1분 후에 다시 시도해 주세요.',
      });
    }

    recent.push(now);
    hits.set(key, recent);

    // 오래된 항목 정리 — 메모리가 무한히 늘지 않게 합니다.
    if (hits.size > 500) {
      for (const [k, v] of hits) {
        if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
      }
    }
    next();
  };

  // Initialize Gemini API client on server
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Endpoint: AI Situational Travel Phrase Generator & Translator
  app.post("/api/gemini/translate", requireAccessCode, rateLimit, async (req, res) => {
    try {
      const { countryName, language, promptText } = req.body ?? {};

      if (typeof promptText !== "string" || !promptText.trim()) {
        return res.status(400).json({ error: "상황 설명을 입력해 주세요." });
      }

      // 입력 길이 제한 — 긴 프롬프트가 그대로 모델로 흘러가면 비용과 남용 위험이 커집니다.
      if (promptText.length > 300) {
        return res.status(400).json({ error: "상황 설명은 300자 이내로 입력해 주세요." });
      }
      if (typeof countryName !== "string" || typeof language !== "string") {
        return res.status(400).json({ error: "잘못된 요청입니다." });
      }

      const systemInstruction = `You are an expert Southeast Asian travel language tutor for Korean travelers.
Given a user's situation/request in Korean, generate the most authentic, natural local phrase in ${countryName} (${language}).
You MUST provide a structured JSON response containing:
- category: One of ["항공", "호텔", "교통", "식당", "흥정", "미팅/사교", "욕설/은어", "비상"] that best fits the situation.
- original: The native local expression/spelling in ${countryName} (${language}).
- translation: The natural Korean translation.
- pronunciation: Clear Korean phonetic pronunciation guide in brackets like "[파라 포!]", "[신 짜오]", "[캅 쿤 캅]", "[막카노 포 이토]".
- toneGuide: Tone/politeness/gender suffix notes (e.g., Standard, Respectful, Polite male/female suffix).
- usageTip: Practical 1-sentence tip on when/how a Korean traveler should use this in ${countryName}.
- isEmergency: boolean (true if this is a high-priority emergency or urgent transportation request suitable for a full-screen display).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Traveler request for ${countryName} (${language}): "${promptText}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              original: { type: Type.STRING },
              translation: { type: Type.STRING },
              pronunciation: { type: Type.STRING },
              toneGuide: { type: Type.STRING },
              usageTip: { type: Type.STRING },
              isEmergency: { type: Type.BOOLEAN }
            },
            required: ["category", "original", "translation", "pronunciation", "toneGuide", "usageTip"]
          }
        }
      });

      const text = response.text || "{}";
      const resultData = JSON.parse(text);
      return res.json({ success: true, phrase: resultData });
    } catch (error: any) {
      // 내부 오류 메시지는 서버 로그에만 남기고 클라이언트에 노출하지 않습니다.
      console.error("Gemini translate error:", error);
      return res.status(500).json({
        error: "AI 번역 생성에 실패했습니다. 잠시 후 다시 시도해 주세요."
      });
    }
  });


  /* ---------------------------------------------------------------- */
  /* 사진 번역 (OCR)                                                    */
  /* ---------------------------------------------------------------- */
  //
  // 메뉴판·표지판·약봉투를 찍으면 읽어서 한국어로 옮깁니다.
  // 여행자가 "찾는 문장이 없다"고 느끼는 순간의 상당수가 사실은
  // "눈앞의 글자를 못 읽겠다" 이기 때문에, 회화집이 못 메우는 구멍을 메웁니다.
  // requireAccessCode·rateLimit 은 헤더/IP 만 보므로 파싱 전에 둡니다.
  // 미인증 요청이 8MB 본문 파싱을 유발하지 않게 하기 위함입니다.
  app.post(OCR_PATH, requireAccessCode, rateLimit, jsonForImages, async (req, res) => {
    try {
      const { imageBase64, mimeType, countryName, language } = req.body ?? {};

      if (typeof imageBase64 !== "string" || !imageBase64) {
        return res.status(400).json({ error: "이미지가 필요합니다." });
      }
      // base64 는 원본의 약 4/3 크기입니다. 6MB ≈ 원본 4.5MB 정도.
      if (imageBase64.length > 6_000_000) {
        return res.status(413).json({ error: "사진 용량이 너무 큽니다. 다시 찍어 주세요." });
      }
      if (typeof mimeType !== "string" || !/^image\/(jpeg|png|webp|heic|heif)$/.test(mimeType)) {
        return res.status(400).json({ error: "지원하지 않는 이미지 형식입니다." });
      }

      const systemInstruction = `You are a translation assistant for Korean travelers in ${countryName ?? "the Philippines"}.
The user photographed a sign, menu, label, or document written in ${language ?? "English or Tagalog"}.

Return JSON with:
- summary: One short Korean sentence describing what this image is (e.g. "식당 메뉴판입니다", "약 복용 안내입니다").
- lines: Array of the readable text blocks. Each item has:
    · original: the text exactly as printed
    · translation: natural Korean translation
    · note: optional short Korean note ONLY when a traveler would be misled without it
            (prices, allergens, warnings, dosage, opening hours). Otherwise omit.
- caution: Optional single Korean sentence if the image contains something the traveler
           must not miss (allergy ingredient, prohibition, fee, deadline). Otherwise omit.

Rules:
- Transcribe only text that is actually legible. Never invent text.
- If nothing is readable, return an empty lines array and say so in summary.
- Keep each translation short enough to read on a phone at a glance.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType, data: imageBase64 } },
              { text: "Read this image and translate it for a Korean traveler." },
            ],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              lines: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    original: { type: Type.STRING },
                    translation: { type: Type.STRING },
                    note: { type: Type.STRING },
                  },
                  required: ["original", "translation"],
                },
              },
              caution: { type: Type.STRING },
            },
            required: ["summary", "lines"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, result: parsed });
    } catch (error: any) {
      console.error("Gemini OCR error:", error);
      return res.status(500).json({
        error: "사진을 읽지 못했습니다. 더 밝은 곳에서 다시 찍어 주세요."
      });
    }
  });

  /* ---------------------------------------------------------------- */
  /* 사용 기록 수집                                                     */
  /* ---------------------------------------------------------------- */
  //
  // ⚠️ Cloud Run 의 파일시스템은 컨테이너가 재시작되면 사라집니다.
  //    그래서 파일에 쓰지 않고 stdout 으로 내보냅니다. Cloud Run 은 stdout 을
  //    자동으로 Cloud Logging 에 실어주고, 거기서 조회·내보내기가 됩니다.
  //    (로컬 개발에서는 그냥 터미널에 찍힙니다)
  //
  //    조회 예:
  //      gcloud logging read 'jsonPayload.gijoEvent.name="search_empty"' \
  //        --limit 200 --format json
  const MAX_EVENTS_PER_BATCH = 50;

  app.post("/api/events", requireAccessCode, rateLimit, (req, res) => {
    const { events } = req.body ?? {};
    if (!Array.isArray(events)) {
      return res.status(400).json({ error: "events 배열이 필요합니다." });
    }

    for (const e of events.slice(0, MAX_EVENTS_PER_BATCH)) {
      if (!e || typeof e.name !== "string") continue;

      // 자유 입력(검색어·AI 질문)이 통째로 흘러들지 않게 길이를 자릅니다.
      const props: Record<string, unknown> = {};
      if (e.props && typeof e.props === "object") {
        for (const [k, v] of Object.entries(e.props).slice(0, 10)) {
          props[String(k).slice(0, 40)] =
            typeof v === "string" ? v.slice(0, 200) : v;
        }
      }

      // 한 줄 JSON — Cloud Logging 이 jsonPayload 로 파싱합니다.
      console.log(
        JSON.stringify({
          gijoEvent: {
            name: String(e.name).slice(0, 40),
            at: typeof e.at === "string" ? e.at.slice(0, 40) : new Date().toISOString(),
            device: typeof e.device === "string" ? e.device.slice(0, 64) : "unknown",
            offline: Boolean(e.offline),
            props,
          },
        })
      );
    }

    // 클라이언트는 응답 본문이 필요 없습니다. 204 로 대역폭을 아낍니다.
    return res.status(204).end();
  });

  // API Endpoint: Health Check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      app: "GIJO Talk",
      accessCodeRequired: Boolean(ACCESS_CODE),
    });
  });

  // 알 수 없는 /api 경로는 여기서 끊습니다. 아래 SPA 폴백으로 새면
  // 오타 난 API 호출이 index.html 을 200 으로 받아 디버깅이 어려워집니다.
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Vite Middleware in Development vs Static in Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    // 해시가 박힌 자산과 오디오는 1년 캐시, index.html 과 sw.js 는 캐시 금지.
    // sw.js 를 캐시하면 새 버전을 배포해도 기기가 옛 워커를 계속 씁니다.
    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          if (/\/(index\.html|sw\.js)$/.test(filePath)) {
            res.setHeader("Cache-Control", "no-cache, must-revalidate");
          } else if (/\/(assets|audio)\//.test(filePath)) {
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          }
        },
      })
    );

    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-cache, must-revalidate");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GIJO Talk server running on http://0.0.0.0:${PORT}`);
    console.log(`  접근 코드: ${ACCESS_CODE ? "설정됨" : "없음 (누구나 AI 호출 가능)"}`);
  });
}

startServer();
