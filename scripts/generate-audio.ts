/**
 * 문장별 오디오 사전 생성 스크립트.
 *
 *   npm run audio            # macOS 내장 음성으로 생성 (무료, 오프라인)
 *   npm run audio -- --force # 이미 있는 파일도 다시 생성
 *   npm run audio -- --backend=google --lang=ph
 *
 * ── 왜 필요한가
 *   브라우저 TTS(speechSynthesis)는 이 앱에서 세 가지가 안 됩니다.
 *     1) 타갈로그(tl-PH) 음성이 어느 기기에도 없습니다.
 *     2) iOS 홈화면 PWA(standalone)에서 무음으로 실패하는 사례가 많습니다.
 *     3) 화면을 끄면 재생이 멈춥니다 — "비행기/택시에서 이어폰으로" 컨셉이 성립 못 합니다.
 *   오디오 파일로 만들어 두면 셋 다 해결되고, 서비스 워커가 캐시하므로 완전 오프라인이 됩니다.
 *
 * ── 백엔드
 *   say    : macOS 내장. 무료·로컬. 영어는 훌륭하고, 타갈로그는 인도네시아어 음성으로 근사합니다.
 *            (인도네시아어는 타갈로그와 같은 오스트로네시아어족이라 모음 체계가 거의 같습니다)
 *   google : Google Cloud TTS. fil-PH 실제 필리핀어 음성이 있어 품질이 가장 좋습니다.
 *            GOOGLE_TTS_API_KEY 환경변수가 필요합니다.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile, rm, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { COUNTRIES, PHRASES } from '../src/config';
import type { Phrase } from '../src/types';

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'audio');
const TMP_DIR = path.join(ROOT, 'node_modules', '.cache', 'gijo-audio');
const MANIFEST_TS = path.join(ROOT, 'src', 'data', 'audioManifest.ts');

/* ------------------------------------------------------------------ */
/* 인자                                                                */
/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);
const flag = (name: string, fallback = '') =>
  args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? fallback;

const BACKEND = flag('backend', 'say') as 'say' | 'google';
const LANG_FILTER = flag('lang', 'all');
const FORCE = args.includes('--force');

/* ------------------------------------------------------------------ */
/* 음성 매핑                                                            */
/* ------------------------------------------------------------------ */

// macOS 내장 음성. `say -v '?'` 로 설치된 목록을 확인할 수 있습니다.
const SAY_VOICE: Record<string, string> = {
  'en-US': 'Samantha',
  'tl-PH': 'Damayanti', // 인도네시아어 — 타갈로그 근사치
  'id-ID': 'Damayanti',
  'vi-VN': 'Linh',
  'th-TH': 'Kanya',
};

// Google Cloud TTS 음성. fil-PH 는 실제 필리핀어입니다.
const GOOGLE_VOICE: Record<string, { languageCode: string; name: string }> = {
  'en-US': { languageCode: 'en-US', name: 'en-US-Neural2-F' },
  'tl-PH': { languageCode: 'fil-PH', name: 'fil-PH-Wavenet-A' },
  'vi-VN': { languageCode: 'vi-VN', name: 'vi-VN-Wavenet-A' },
  'th-TH': { languageCode: 'th-TH', name: 'th-TH-Neural2-C' },
};

/* ------------------------------------------------------------------ */
/* 어떤 문장에 오디오를 만들 것인가                                       */
/* ------------------------------------------------------------------ */

/**
 * 🔴 로 표시한 강한 욕설은 오디오를 만들지 않습니다.
 *
 * 이 항목들은 "알아듣기" 용도로만 넣은 것이고, 재생 버튼이 있으면
 * 공공장소에서 실수로 크게 틀 위험이 있습니다. 전광판 모드는 열자마자
 * 자동 재생되기 때문에 특히 위험합니다. 화면에는 그대로 보여주되
 * 소리로는 내보내지 않는 쪽이 맞습니다.
 */
function shouldSkipAudio(p: Phrase): string | null {
  if (p.toneGuide?.startsWith('🔴')) return '강한 욕설 — 의도적으로 음성 생성 안 함';
  if (p.original.includes('*')) return '마스킹된 텍스트';
  return null;
}

/* ------------------------------------------------------------------ */
/* 백엔드 구현                                                          */
/* ------------------------------------------------------------------ */

async function synthesizeWithSay(text: string, langCode: string, outPath: string) {
  const voice = SAY_VOICE[langCode];
  if (!voice) throw new Error(`macOS 음성 매핑 없음: ${langCode}`);

  const aiff = path.join(TMP_DIR, `${path.basename(outPath, '.m4a')}.aiff`);
  await run('say', ['-v', voice, '-r', '170', '-o', aiff, text]);
  // 48kbps 모노 AAC — 음성에는 충분하고 1초당 약 6KB 입니다.
  await run('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '48000', '-q', '127', aiff, outPath]);
  await rm(aiff, { force: true });
}

async function synthesizeWithGoogle(text: string, langCode: string, outPath: string) {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_TTS_API_KEY 환경변수가 필요합니다.');

  const voice = GOOGLE_VOICE[langCode];
  if (!voice) throw new Error(`Google 음성 매핑 없음: ${langCode}`);

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: voice.languageCode, name: voice.name },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95, sampleRateHertz: 24000 },
      }),
    }
  );

  if (!res.ok) throw new Error(`Google TTS ${res.status}: ${await res.text()}`);
  const { audioContent } = (await res.json()) as { audioContent: string };
  // MP3 는 iOS/안드로이드/데스크톱 모두 지원합니다. 확장자만 맞춰 저장합니다.
  await writeFile(outPath.replace(/\.m4a$/, '.mp3'), Buffer.from(audioContent, 'base64'));
}

/* ------------------------------------------------------------------ */
/* 메인                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  const targets = COUNTRIES.filter((c) => LANG_FILTER === 'all' || c.id === LANG_FILTER);
  if (targets.length === 0) {
    console.error(`--lang=${LANG_FILTER} 에 해당하는 언어가 없습니다.`);
    process.exit(1);
  }

  await mkdir(TMP_DIR, { recursive: true });

  const ext = BACKEND === 'google' ? '.mp3' : '.m4a';
  const generated: Record<string, string> = {};
  const skipped: Array<{ id: string; reason: string }> = [];
  let made = 0;
  let reused = 0;
  let failed = 0;

  for (const country of targets) {
    const dir = path.join(OUT_DIR, country.id);
    await mkdir(dir, { recursive: true });

    const list = PHRASES.filter((p) => p.countryId === country.id);
    console.log(`\n▶ ${country.flag} ${country.name} (${country.langCode}) — ${list.length}개`);

    for (const p of list) {
      const skip = shouldSkipAudio(p);
      if (skip) {
        skipped.push({ id: p.id, reason: skip });
        continue;
      }

      const outPath = path.join(dir, `${p.id}${ext}`);
      const rel = `${country.id}/${p.id}${ext}`;

      if (!FORCE && existsSync(outPath)) {
        generated[p.id] = rel;
        reused++;
        continue;
      }

      try {
        if (BACKEND === 'google') {
          await synthesizeWithGoogle(p.original, country.langCode, outPath);
        } else {
          await synthesizeWithSay(p.original, country.langCode, outPath);
        }
        generated[p.id] = rel;
        made++;
        process.stdout.write('.');
      } catch (err) {
        failed++;
        console.error(`\n  ✗ ${p.id}: ${(err as Error).message}`);
      }
    }
    process.stdout.write('\n');
  }

  // 앱이 "어떤 문장에 녹음이 있는지" 를 런타임 fetch 없이 알 수 있도록
  // TS 파일로 내보냅니다. 번들에 포함되므로 오프라인에서도 즉시 동작합니다.
  const entries = Object.entries(generated).sort(([a], [b]) => a.localeCompare(b));
  const manifest = `// 이 파일은 \`npm run audio\` 가 자동 생성합니다. 직접 수정하지 마세요.
// 생성 백엔드: ${BACKEND}

// 서브패스 배포에서도 동작하도록 빌드 base 를 붙입니다.
export const AUDIO_BASE = \`\${import.meta.env.BASE_URL}audio\`;

/** 사전 생성된 오디오가 있는 문장 id → 상대 경로 */
export const AUDIO_FILES: Record<string, string> = {
${entries.map(([id, rel]) => `  '${id}': '${rel}',`).join('\n')}
};

export const hasRecordedAudio = (phraseId: string): boolean =>
  Object.prototype.hasOwnProperty.call(AUDIO_FILES, phraseId);

export const audioUrlFor = (phraseId: string): string | null =>
  AUDIO_FILES[phraseId] ? \`\${AUDIO_BASE}/\${AUDIO_FILES[phraseId]}\` : null;
`;
  await writeFile(MANIFEST_TS, manifest, 'utf8');

  console.log('\n────────────────────────────────');
  console.log(`  새로 생성   ${made}`);
  console.log(`  재사용      ${reused}`);
  console.log(`  실패        ${failed}`);
  console.log(`  의도적 제외 ${skipped.length}`);
  skipped.forEach((s) => console.log(`     · ${s.id} — ${s.reason}`));
  console.log(`\n  매니페스트  src/data/audioManifest.ts (${entries.length}개)`);
  console.log('────────────────────────────────');

  await access(OUT_DIR).catch(() => {});
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
