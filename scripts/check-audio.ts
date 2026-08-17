/**
 * 커밋된 오디오가 문장 데이터와 맞는지 확인합니다.
 *
 *   npm run audio:check
 *
 * 오디오는 macOS 의 `say` 로 만들기 때문에 리눅스 CI 에서는 재생성할 수 없습니다.
 * 그래서 CI 는 "생성"이 아니라 "검사"만 합니다. 문장을 추가하고 `npm run audio` 를
 * 잊은 채 배포하면 그 문장만 소리가 안 나는데, 현지에 가서야 알게 됩니다.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { PHRASES, COUNTRIES } from '../src/config';
import { AUDIO_FILES } from '../src/data/audioManifest';

const ROOT = path.resolve(import.meta.dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio');

/** generate-audio.ts 와 같은 규칙 — 강한 욕설은 의도적으로 음성을 만들지 않습니다. */
const intentionallySilent = (toneGuide?: string, original?: string) =>
  Boolean(toneGuide?.startsWith('🔴')) || Boolean(original?.includes('*'));

/**
 * 오디오를 아직 한 번도 생성하지 않은 나라.
 *
 * 이 나라들의 문장은 매니페스트에 없는 게 정상이므로 하드 실패시키지 않고
 * "대기 중"으로만 집계합니다. macOS 에서 `npm run audio` 를 돌리거나 Google
 * TTS 백엔드로 생성한 뒤 여기서 빼면, 그 다음부터는 이 나라도 다른 나라와
 * 똑같이 엄격하게 검사됩니다.
 *
 * 베트남은 Google TTS 백엔드로 생성을 마쳐서 뺐습니다.
 */
const AUDIO_PENDING_COUNTRIES = new Set<string>([]);

const problems: string[] = [];
let expected = 0;
let silent = 0;
let pending = 0;

for (const phrase of PHRASES) {
  if (intentionallySilent(phrase.toneGuide, phrase.original)) {
    silent++;
    if (AUDIO_FILES[phrase.id]) {
      problems.push(
        `${phrase.id}: 강한 욕설인데 오디오가 있습니다. \`npm run audio -- --force\` 로 다시 만드세요.`
      );
    }
    continue;
  }

  expected++;

  const rel = AUDIO_FILES[phrase.id];
  if (!rel) {
    if (AUDIO_PENDING_COUNTRIES.has(phrase.countryId)) {
      pending++;
    } else {
      problems.push(`${phrase.id}: 매니페스트에 없습니다. \`npm run audio\` 를 실행하고 커밋하세요.`);
    }
    continue;
  }
  if (!existsSync(path.join(AUDIO_DIR, rel))) {
    problems.push(`${phrase.id}: 매니페스트에는 있는데 파일이 없습니다 (${rel}).`);
  }
}

// 반대 방향 — 문장은 지웠는데 오디오만 남은 경우
const validIds = new Set(PHRASES.map((p) => p.id));
for (const id of Object.keys(AUDIO_FILES)) {
  if (!validIds.has(id)) {
    problems.push(`${id}: 문장은 없는데 오디오만 남아 있습니다.`);
  }
}

const byCountry = COUNTRIES.map((c) => {
  const n = PHRASES.filter((p) => p.countryId === c.id).length;
  return `${c.flag} ${c.name} ${n}개`;
}).join(' · ');

console.log(`문장 ${PHRASES.length}개 (${byCountry})`);
console.log(`오디오 필요 ${expected}개 · 매니페스트 ${Object.keys(AUDIO_FILES).length}개 · 의도적 무음 ${silent}개`);
if (pending > 0) {
  const names = [...AUDIO_PENDING_COUNTRIES]
    .map((id) => COUNTRIES.find((c) => c.id === id)?.name ?? id)
    .join(', ');
  console.log(`⏳ 오디오 생성 대기 ${pending}개 (${names}) — 하드 실패로 치지 않습니다.`);
}

if (problems.length > 0) {
  console.error(`\n❌ 문제 ${problems.length}건:`);
  problems.forEach((p) => console.error(`   · ${p}`));
  process.exit(1);
}

console.log('\n✓ 오디오와 문장 데이터가 일치합니다.');
