/**
 * 앱 잠금 번호의 해시를 만듭니다.
 *
 *   npm run passcode -- 0070
 *
 * 출력된 상수를 src/utils/appLock.ts 에 붙여넣으면 됩니다.
 *
 * ── 왜 해시로 두는가
 *   정적 앱은 코드가 전부 브라우저로 내려갑니다. 번호를 평문으로 적어두면
 *   개발자도구에서 검색 한 번에 나옵니다. 해시만 두면 번들에는 원본이
 *   존재하지 않습니다.
 *
 * ── 그래도 완전하지 않습니다 (숨기지 말 것)
 *   4자리 숫자는 경우의 수가 1만 개뿐입니다. 해시를 손에 넣은 사람이
 *   1만 개를 다 넣어보면 결국 찾아냅니다. 그래서 PBKDF2 를 20만 회 돌려
 *   한 번 시도할 때마다 시간이 걸리게 했습니다 — 전수 조사에 노트북 기준
 *   수십 분이 듭니다. "쓱 봐서는 모른다" 를 "작정해야 뚫린다" 로 올리는 정도이고,
 *   진짜 보안이 필요하면 자리 수를 늘리는 편이 훨씬 효과적입니다.
 *   (6자리 영숫자면 전수 조사가 사실상 불가능해집니다)
 */

const ITERATIONS = 200_000;

/** 소금. 같은 번호라도 다른 앱과 해시가 겹치지 않게 합니다. */
const SALT = 'gijo-tour-ph-lock-v1';

async function derive(passcode: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(passcode), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(SALT), iterations: ITERATIONS, hash: 'SHA-256' },
    key,
    256
  );
  return Buffer.from(new Uint8Array(bits)).toString('base64');
}

const passcode = process.argv[2];
if (!passcode) {
  console.error('사용법: npm run passcode -- <번호>');
  process.exit(1);
}

const started = Date.now();
const hash = await derive(passcode);
const took = Date.now() - started;

console.log('');
console.log('src/utils/appLock.ts 의 상수를 아래로 바꾸세요:');
console.log('');
console.log(`  const PASSCODE_HASH = '${hash}';`);
console.log('');
console.log(`  (한 번 확인하는 데 ${took}ms — 전수 조사 1만 개면 약 ${Math.round((took * 10000) / 60000)}분)`);
console.log('');
