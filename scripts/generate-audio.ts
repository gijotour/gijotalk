/**
 * 문장별 오디오 사전 생성 스크립트.
 *
 *   npm run audio            # macOS 내장 음성으로 생성 (무료, 오프라인)
 *   npm run audio -- --force # 이미 있는 파일도 다시 생성
 *   npm run audio -- --backend=google --lang=ph
 *   npm run audio -- --vocab            # 문장 대신 어휘(단어·짧은 말·대화) 오디오
 *   npm run audio -- --vocab --dry-run  # 몇 개 만들지만 세어 보고 끝냅니다
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
 *   espeak : espeak-ng(리눅스에서도 동작하는 오픈소스 포먼트 합성기) + ffmpeg.
 *            macOS 도 Google 키도 없는 환경(예: 리눅스 CI 컨테이너)에서 쓰는
 *            임시 대안입니다. 발음 규칙은 정확하지만 기계음에 가깝게 들립니다
 *            — say/Google 이 가능해지면 `--force` 로 다시 만들어 교체하세요.
 *            `apt install espeak-ng ffmpeg` 필요.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile, readFile, rm, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { COUNTRIES, PHRASES } from '../src/config';
import { VOCAB_WORDS, VOCAB_EXPRESSIONS, VOCAB_DIALOGS } from '../src/data/vocab';
import type { CountryId, Phrase } from '../src/types';
import { brighten } from './brighten';

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

const BACKEND = flag('backend', 'say') as 'say' | 'google' | 'espeak';
const LANG_FILTER = flag('lang', 'all');
const FORCE = args.includes('--force');
/** 문장(PHRASES) 대신 어휘(단어·짧은 말·대화)를 만듭니다. docs/VOCAB_PLAN.md §6 */
const VOCAB = args.includes('--vocab');
/** 실제로 만들지 않고 "몇 개를 만들 것인지" 만 세어 보고 끝냅니다. */
const DRY_RUN = args.includes('--dry-run');

/* ------------------------------------------------------------------ */
/* 음성 매핑                                                            */
/* ------------------------------------------------------------------ */

/**
 * macOS 내장 음성.
 *
 * ⚠️ 이름만으로 고르면 안 됩니다.
 *    같은 이름이 여러 언어에 존재합니다 — `say -v Reed` 는 독일어 Reed 를
 *    집을 수도 있습니다(실제로 미국 영어 Reed 와 결과가 달랐습니다).
 *    그래서 `say -v '?'` 목록에서 로케일까지 맞는 항목을 찾아 정확한 이름을 씁니다.
 *
 * ── 성별
 *   영어는 남성(Reed), 타갈로그는 여성(Damayanti)입니다.
 *   두 트랙을 목소리로 구분하면 어느 언어를 듣고 있는지 소리만으로 알 수 있습니다.
 */
interface VoiceSpec {
  /** 앞에서부터 설치된 것을 찾습니다 */
  candidates: Array<{ locale: string; name: string }>;
  /** 말하기 속도 (기본 175). 낮출수록 또박또박해집니다. */
  rate: number;
  /** 기본 음높이. 올리면 밝게 들립니다. 생략하면 음성 기본값. */
  pitch?: number;
  /**
   * 합성 뒤 밝기·음량 보정.
   * macOS 미국 남성 음성은 그대로 쓰면 어둡고 작습니다. 목소리를 바꾸는 대신
   * 나온 소리를 손봅니다 — 발음은 미국 것이어야 하기 때문입니다.
   */
  polish?: { shelfHz: number; gainDb: number; peakDb: number };
}

const SAY_VOICE: Record<string, VoiceSpec> = {
  // 영어는 가장 깔끔하게 들리는 음성으로 갑니다 — Daniel.
  //
  //   설치된 음성들을 같은 문장으로 재본 결과(밝기 = 영교차율):
  //     Reed 1416 · Eddy 1427 · Ralph 1310 · Rocko 1113 · Daniel 4436
  //   미국 음성은 피치를 올리고 EQ 로 자음을 들어올려도 3249 가 한계였고,
  //   그 과정에서 소리에 색이 입혀집니다. Daniel 은 손대지 않아도 그보다
  //   밝고 또렷합니다.
  //
  //   Daniel 은 영국 억양입니다. 듣고 따라 하는 용도라 또렷함을 택했고,
  //   필리핀에서 영국 억양은 문제없이 통합니다.
  //   미국 발음으로 바꾸려면 candidates 에서 Daniel 을 빼고 polish.gainDb 를
  //   10 쯤으로 올리세요 (그래야 안 어둡습니다).
  'en-US': {
    candidates: [
      { locale: 'en_GB', name: 'Daniel' },
      { locale: 'en_US', name: 'Reed' },
      { locale: 'en_US', name: 'Ralph' },
    ],
    rate: 145, // 또박또박하게. Daniel 은 빨라서 낮춰도 답답하지 않습니다.
    // EQ 는 걸지 않습니다(gainDb 0). 이미 충분히 밝아서 더 올리면 치찰음만
    // 거슬립니다. 음량만 고르게 맞춥니다 — 문장마다 크기가 들쭉날쭉하면
    // 흔들리는 차 안에서 어떤 건 안 들립니다.
    polish: { shelfHz: 2500, gainDb: 0, peakDb: -1 },
  },
  // 인도네시아어 — 타갈로그와 같은 오스트로네시아어족이라 모음이 거의 같습니다.
  'tl-PH': { candidates: [{ locale: 'id_ID', name: 'Damayanti' }], rate: 170 },
  'id-ID': { candidates: [{ locale: 'id_ID', name: 'Damayanti' }], rate: 170 },
  'vi-VN': { candidates: [{ locale: 'vi_VN', name: 'Linh' }], rate: 170 },
  'th-TH': { candidates: [{ locale: 'th_TH', name: 'Kanya' }], rate: 170 },
};

/** `say -v '?'` 를 한 번만 읽어 캐시합니다. */
let installedVoices: Array<{ name: string; locale: string }> | null = null;

async function listVoices() {
  if (installedVoices) return installedVoices;
  const { stdout } = await run('say', ['-v', '?']);
  installedVoices = stdout
    .split('\n')
    .map((line) => line.match(/^(.*?)\s{2,}([a-z]{2}_[A-Z]{2})\s/))
    .filter((m): m is RegExpMatchArray => Boolean(m))
    .map((m) => ({ name: m[1].trim(), locale: m[2] }));
  return installedVoices;
}

/** 로케일까지 맞는 실제 음성 이름을 찾습니다. */
async function resolveVoice(langCode: string): Promise<string> {
  const want = SAY_VOICE[langCode];
  if (!want) throw new Error(`macOS 음성 매핑 없음: ${langCode}`);

  const voices = await listVoices();
  for (const c of want.candidates) {
    const hit = voices.find((v) => v.locale === c.locale && v.name.startsWith(c.name));
    if (hit) return hit.name;
  }
  throw new Error(
    `${langCode} 용 음성을 찾지 못했습니다 ` +
      `(${want.candidates.map((c) => `${c.name}/${c.locale}`).join(', ')}). ` +
      `시스템 설정 > 손쉬운 사용 > 음성 에서 내려받으세요.`
  );
}

// Google Cloud TTS 음성. fil-PH 는 실제 필리핀어입니다.
const GOOGLE_VOICE: Record<string, { languageCode: string; name: string }> = {
  'en-US': { languageCode: 'en-US', name: 'en-US-Neural2-F' },
  'tl-PH': { languageCode: 'fil-PH', name: 'fil-PH-Wavenet-A' },
  'vi-VN': { languageCode: 'vi-VN', name: 'vi-VN-Wavenet-A' },
  'th-TH': { languageCode: 'th-TH', name: 'th-TH-Neural2-C' },
};

// espeak-ng 음성. `espeak-ng --voices=<lang>` 로 설치된 목록을 확인합니다.
// 베트남어는 북/중/중남부 세 변종이 있는데, 하노이 표준어에 가장 가까운
// 북부(vi)를 기본으로 씁니다.
const ESPEAK_VOICE: Record<string, { voice: string; rate: number }> = {
  'vi-VN': { voice: 'vi', rate: 150 },
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

/**
 * 만들 오디오 한 개.
 *
 * 문장이든 어휘든 결국 "이 id 로, 이 글을, 이 언어 목소리로" 가 전부입니다.
 * 그래서 둘을 같은 모양으로 바꿔 두고 아래 파이프라인은 하나만 씁니다.
 */
interface AudioJob {
  /** 매니페스트 키이자 파일 이름 (확장자 제외) */
  id: string;
  /** 실제로 읽을 글 */
  text: string;
  /** 파일이 들어갈 폴더 = 항목이 속한 나라 */
  countryId: CountryId;
  /** 목소리를 고르는 기준. 필리핀 어휘의 영어 병기만 여기가 en-US 가 됩니다. */
  langCode: string;
  /** 값이 있으면 일부러 만들지 않습니다 */
  skipReason?: string;
}

/** 필리핀 어휘의 영어 병기에 쓸 목소리 — 영어 트랙과 같은 것을 씁니다. */
const EN_LANG_CODE = COUNTRIES.find((c) => c.id === 'en')?.langCode ?? 'en-US';

function phraseJobs(countryId: CountryId, langCode: string): AudioJob[] {
  return PHRASES.filter((p) => p.countryId === countryId).map((p) => ({
    id: p.id,
    text: p.original,
    countryId,
    langCode,
    skipReason: shouldSkipAudio(p) ?? undefined,
  }));
}

/**
 * 어휘 작업 목록.
 *
 * 단어·짧은 말은 id 를 그대로 쓰고, 대화는 줄마다 `{id}-L1` … `{id}-L4` 입니다
 * (UI 가 줄 단위로 재생하기 때문입니다).
 * 필리핀은 영어를 나란히 보여주므로 `{id}-en` 파일을 하나 더 만듭니다.
 */
function vocabJobs(countryId: CountryId, langCode: string): AudioJob[] {
  const jobs: AudioJob[] = [];
  const add = (id: string, text: string, textEn?: string) => {
    jobs.push({ id, text, countryId, langCode });
    if (textEn) jobs.push({ id: `${id}-en`, text: textEn, countryId, langCode: EN_LANG_CODE });
  };

  for (const w of VOCAB_WORDS.filter((x) => x.countryId === countryId)) add(w.id, w.word, w.wordEn);
  for (const e of VOCAB_EXPRESSIONS.filter((x) => x.countryId === countryId)) add(e.id, e.text, e.textEn);
  for (const d of VOCAB_DIALOGS.filter((x) => x.countryId === countryId)) {
    d.lines.forEach((line, i) => add(`${d.id}-L${i + 1}`, line.text, line.textEn));
  }
  return jobs;
}

const jobsFor = (countryId: CountryId, langCode: string): AudioJob[] =>
  VOCAB ? vocabJobs(countryId, langCode) : phraseJobs(countryId, langCode);

/* ------------------------------------------------------------------ */
/* 후처리                                                              */
/* ------------------------------------------------------------------ */

/**
 * say 가 뱉은 AIFF 를 제자리에서 보정합니다.
 *
 * AIFF 는 빅엔디안 16비트 PCM 입니다. SSND 청크의 오디오 데이터만 손대고
 * 헤더는 그대로 두므로 길이·샘플레이트가 바뀌지 않습니다.
 */
async function polishAiff(file: string, opts: { shelfHz: number; gainDb: number; peakDb: number }) {
  const buf = await readFile(file);

  // COMM 청크에서 샘플레이트와 채널 수를 읽습니다.
  const commAt = buf.indexOf('COMM');
  const ssndAt = buf.indexOf('SSND');
  if (commAt < 0 || ssndAt < 0) return; // 모르는 형식이면 건드리지 않습니다

  const channels = buf.readUInt16BE(commAt + 8);
  const bits = buf.readUInt16BE(commAt + 14);
  if (bits !== 16) return;

  // 80비트 확장 부동소수 — 정수부만 있으면 충분합니다.
  const expo = buf.readUInt16BE(commAt + 16) - 16383;
  const mant = Number(buf.readBigUInt64BE(commAt + 18));
  const sampleRate = Math.round(mant / Math.pow(2, 63 - expo));

  // SSND: 4바이트 크기 + offset(4) + blockSize(4) 다음이 오디오입니다.
  const dataStart = ssndAt + 4 + 4 + 8;
  const dataEnd = ssndAt + 4 + 4 + buf.readUInt32BE(ssndAt + 4);
  const count = Math.floor((dataEnd - dataStart) / 2);

  const samples = new Int16Array(count);
  for (let i = 0; i < count; i++) samples[i] = buf.readInt16BE(dataStart + i * 2);

  const fixed = brighten(samples, { sampleRate, shelfHz: opts.shelfHz, gainDb: opts.gainDb, peakDb: opts.peakDb });
  void channels;

  for (let i = 0; i < count; i++) buf.writeInt16BE(fixed[i], dataStart + i * 2);
  await writeFile(file, buf);
}

/* ------------------------------------------------------------------ */
/* 백엔드 구현                                                          */
/* ------------------------------------------------------------------ */

async function synthesizeWithSay(text: string, langCode: string, outPath: string) {
  const voice = await resolveVoice(langCode);
  const spec = SAY_VOICE[langCode];

  // [[pbas N]] 은 say 의 음높이 지정입니다. 문장 맨 앞에 와야 합니다.
  const spoken = spec.pitch ? `[[pbas ${spec.pitch}]] ${text}` : text;

  const aiff = path.join(TMP_DIR, `${path.basename(outPath, '.m4a')}.aiff`);
  await run('say', ['-v', voice, '-r', String(spec.rate), '-o', aiff, spoken]);
  if (spec.polish) await polishAiff(aiff, spec.polish);
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

async function synthesizeWithEspeak(text: string, langCode: string, outPath: string) {
  const spec = ESPEAK_VOICE[langCode];
  if (!spec) throw new Error(`espeak-ng 음성 매핑 없음: ${langCode}`);

  // ⚠️ ffmpeg 로 뽑은 AAC/M4A(.m4a)는 ffprobe 로는 멀쩡해 보여도 크롬의 내장
  //    디먹서(FFmpegDemuxer)가 DEMUXER_ERROR_NO_SUPPORTED_STREAMS 로 거부했습니다
  //    — moov 위치(+faststart)나 Range 지원 문제가 아니라 인코더가 뱉는 AAC
  //    extradata 자체를 크롬이 더 깐깐하게 봅니다. MP3(libmp3lame)는 같은
  //    파이프라인에서 문제없이 재생되어 이쪽으로 통일합니다 — Google 백엔드도
  //    이미 mp3 를 씁니다.
  const wav = path.join(TMP_DIR, `${path.basename(outPath, '.mp3')}.wav`);
  await run('espeak-ng', ['-v', spec.voice, '-s', String(spec.rate), '-w', wav, text]);
  // say 백엔드의 polish 와 같은 목적 — loudnorm 으로 문장마다 들쭉날쭉한 음량을 고릅니다.
  await run('ffmpeg', [
    '-y',
    '-i',
    wav,
    '-af',
    'loudnorm=I=-16:TP=-1.5:LRA=11',
    '-c:a',
    'libmp3lame',
    '-b:a',
    '96k',
    '-ar',
    '44100',
    outPath,
  ]);
  await rm(wav, { force: true });
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

  // 세어만 보고 끝내기. 목소리도 API 키도 필요 없으니 가장 먼저 처리합니다.
  if (DRY_RUN) {
    console.log(`\n▶ dry-run — ${VOCAB ? '어휘' : '문장'} / 백엔드 ${BACKEND}`);
    let total = 0;
    for (const country of targets) {
      const list = jobsFor(country.id, country.langCode);
      const make = list.filter((j) => !j.skipReason);
      total += make.length;
      console.log(
        `  ${country.flag} ${country.name} (${country.langCode}) — ${make.length}개` +
          (list.length !== make.length ? ` (제외 ${list.length - make.length})` : '')
      );
    }
    console.log(`  합계 ${total}개`);
    return;
  }

  // 키가 없으면 항목마다 실패를 쌓지 말고 여기서 바로 멈춥니다.
  if (BACKEND === 'google' && !process.env.GOOGLE_TTS_API_KEY) {
    console.error('GOOGLE_TTS_API_KEY 환경변수가 필요합니다.');
    process.exit(1);
  }

  await mkdir(TMP_DIR, { recursive: true });

  const ext = BACKEND === 'google' || BACKEND === 'espeak' ? '.mp3' : '.m4a';
  const generated: Record<string, string> = {};
  const skipped: Array<{ id: string; reason: string }> = [];
  let made = 0;
  let reused = 0;
  let failed = 0;

  for (const country of targets) {
    const dir = path.join(OUT_DIR, country.id);
    await mkdir(dir, { recursive: true });

    const list = jobsFor(country.id, country.langCode);
    console.log(`\n▶ ${country.flag} ${country.name} (${country.langCode}) — ${list.length}개`);

    for (const job of list) {
      if (job.skipReason) {
        skipped.push({ id: job.id, reason: job.skipReason });
        continue;
      }

      const outPath = path.join(dir, `${job.id}${ext}`);
      const rel = `${country.id}/${job.id}${ext}`;

      if (!FORCE && existsSync(outPath)) {
        generated[job.id] = rel;
        reused++;
        continue;
      }

      try {
        if (BACKEND === 'google') {
          await synthesizeWithGoogle(job.text, job.langCode, outPath);
        } else if (BACKEND === 'espeak') {
          await synthesizeWithEspeak(job.text, job.langCode, outPath);
        } else {
          await synthesizeWithSay(job.text, job.langCode, outPath);
        }
        generated[job.id] = rel;
        made++;
        process.stdout.write('.');
      } catch (err) {
        failed++;
        console.error(`\n  ✗ ${job.id}: ${(err as Error).message}`);
      }
    }
    process.stdout.write('\n');
  }

  // 앱이 "어떤 문장에 녹음이 있는지" 를 런타임 fetch 없이 알 수 있도록
  // TS 파일로 내보냅니다. 번들에 포함되므로 오프라인에서도 즉시 동작합니다.
  //
  // ⚠️ 이번에 만든 것만 적으면 안 됩니다.
  //    --lang=en 처럼 한 언어만 다시 만들면 매니페스트에서 나머지 언어가 통째로
  //    사라져, 앱에서 타갈로그 음성이 전부 먹통이 됩니다(실제로 겪었습니다).
  //    그래서 필터와 무관하게 "디스크에 파일이 있는 모든 문장" 을 기준으로 씁니다.
  //    확장자도 둘 다 봅니다 — say 는 .m4a, google/espeak 는 .mp3 라 나라마다
  //    다른 백엔드로 만들어졌을 수 있습니다.
  //
  //    `--vocab` 이 생긴 뒤로는 문장과 어휘를 둘 다 훑습니다. 한쪽만 보면
  //    `npm run audio`(문장) 한 번에 어휘 오디오가 매니페스트에서 통째로 사라집니다.
  for (const country of COUNTRIES) {
    const all = [
      ...phraseJobs(country.id, country.langCode),
      ...vocabJobs(country.id, country.langCode),
    ];
    for (const phrase of all) {
      if (generated[phrase.id] || phrase.skipReason) continue;
      const found = await Promise.all(
        ['.m4a', '.mp3'].map(async (candidateExt) => {
          const candidateRel = `${country.id}/${phrase.id}${candidateExt}`;
          const exists = await access(path.join(OUT_DIR, candidateRel)).then(
            () => true,
            () => false
          );
          return exists ? candidateRel : null;
        })
      );
      const rel = found.find((r): r is string => Boolean(r));
      if (rel) generated[phrase.id] = rel;
    }
  }

  const entries = Object.entries(generated).sort(([a], [b]) => a.localeCompare(b));

  // 오디오 판(revision) — 파일 "내용" 을 해시합니다.
  //
  //   파일 이름은 그대로인 채 내용만 바뀌는 일이 잦습니다(음성 교체·EQ 조정).
  //   그때 기기에 저장해 둔 오디오가 그대로 남아 옛 목소리가 계속 재생됐습니다.
  //   목록만 해시하면 이름이 안 바뀌니 못 잡습니다. 그래서 내용을 봅니다.
  const hash = createHash('sha1');
  for (const [id, rel] of entries) {
    hash.update(id);
    hash.update(await readFile(path.join(OUT_DIR, rel)));
  }
  const revision = hash.digest('hex').slice(0, 8);
  const manifest = `// 이 파일은 \`npm run audio\` 가 자동 생성합니다. 직접 수정하지 마세요.
// 생성 백엔드: ${BACKEND}

import { BASE_URL } from '../utils/env';

// 서브패스 배포에서도 동작하도록 빌드 base 를 붙입니다.
export const AUDIO_BASE = \`\${BASE_URL}audio\`;

/**
 * 오디오 내용의 판 번호. 파일 하나라도 바뀌면 달라집니다.
 * 기기에 저장해 둔 오디오를 언제 갈아치울지 판단하는 데 씁니다.
 */
export const AUDIO_REVISION = '${revision}';

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
  console.log(`\n  매니페스트  src/data/audioManifest.ts (${entries.length}개 · 판 ${revision})`);
  console.log('────────────────────────────────');

  await access(OUT_DIR).catch(() => {});
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
