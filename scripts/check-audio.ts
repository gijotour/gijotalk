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

const problems: string[] = [];
let expected = 0;
let silent = 0;

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
    problems.push(`${phrase.id}: 매니페스트에 없습니다. \`npm run audio\` 를 실행하고 커밋하세요.`);
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

if (problems.length > 0) {
  console.error(`\n❌ 문제 ${problems.length}건:`);
  problems.forEach((p) => console.error(`   · ${p}`));
  process.exit(1);
}

console.log('\n✓ 오디오와 문장 데이터가 일치합니다.');
