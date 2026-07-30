import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
  app.post("/api/gemini/translate", async (req, res) => {
    try {
      const { countryName, language, promptText } = req.body;

      if (!promptText) {
        return res.status(400).json({ error: "Situational prompt is required." });
      }

      const systemInstruction = `You are an expert Southeast Asian travel language tutor for Korean travelers.
Given a user's situation/request in Korean, generate the most authentic, natural local phrase in ${countryName} (${language}).
You MUST provide a structured JSON response containing:
- category: One of ["항공", "호텔", "교통", "식당", "흥정", "미팅/사교", "비상"] that best fits the situation.
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
      console.error("Gemini translate error:", error);
      return res.status(500).json({
        error: "AI 번역 생성 실패. 잠시 후 다시 시도해 주세요.",
        details: error?.message || String(error)
      });
    }
  });

  // API Endpoint: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Quick Pass" });
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
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Quick Pass server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
