// 앱 잠금.
//
// ── 번호는 코드에 없습니다
//   번들에는 PBKDF2 해시만 들어갑니다. 개발자도구에서 코드를 뒤져도 번호 자체는
//   나오지 않습니다. 번호를 바꾸려면 `npm run passcode -- <번호>` 로 새 해시를
//   뽑아 아래 상수만 갈아끼우면 됩니다.
//
// ── ⚠️ 그래도 완전한 보안은 아닙니다 (숨기지 말 것)
//   6자리 숫자는 경우의 수가 100만 개입니다(4자리 1만 개의 100배). 해시를
//   손에 넣은 사람이 다 넣어보면 결국 찾아냅니다. 그래서 PBKDF2 를 20만 회
//   돌려 한 번 시도에 시간이 걸리게 했습니다 — 전수 조사에 노트북 기준
//   반나절 안팎입니다.
//
//   즉 이 잠금이 막는 것은 "주소를 우연히 알게 된 사람이 그냥 열어보는 것" 입니다.
//   작정한 사람은 뚫립니다. 진짜로 막아야 할 정보(여권번호 등)는 잠금을 믿지 말고
//   애초에 앱과 시트에 넣지 않는 편이 맞습니다.
//   보호 수준을 더 올리려면 숫자 대신 영숫자를 섞으세요 — 같은 6자리라도
//   영숫자는 경우의 수가 숫자 6자리의 수만 배가 되어 전수 조사가 사실상
//   불가능해집니다.
//
// ── 한 번만 묻습니다
//   현지에서 앱을 열 때마다 번호를 치게 하면 아무도 안 씁니다.
//   푼 기기에는 기억해두고 다시 묻지 않습니다.
//
// ── 오프라인에서도 풀립니다
//   확인이 전부 기기 안에서 이뤄집니다. 비행기 안에서도 잠금이 열립니다.

/**
 * 푼 기기에 남기는 표시.
 * 값으로 해시를 저장합니다 — 번호를 바꾸면 해시가 달라져 다시 묻게 됩니다.
 * (해시는 어차피 번들에 들어 있으므로 내보내도 새로 새는 정보가 없습니다.
 *  테스트가 잠금을 풀어두는 데 씁니다.)
 */
export const UNLOCK_STORAGE_KEY = 'gijo_app_unlocked_v1';

/** `npm run passcode -- <번호>` 로 만든 값 */
export const PASSCODE_HASH = 'vQhLRqIt5Ey0XW5SOvg59TzzC2iNuumhcVxHlmo6vmc=';

const SALT = 'gijo-tour-ph-lock-v1';
const ITERATIONS = 200_000;

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;

/**
 * 잠금을 쓸지.
 * 테스트나 개발에서 끄고 싶으면 VITE_APP_LOCK=off 로 빌드/실행합니다.
 */
export const isLockEnabled = (): boolean => env?.VITE_APP_LOCK !== 'off';

/** 문의 안내 — 잠금 화면에 그대로 보여줍니다. */
export const LOCK_CONTACT = {
  company: '지아이조테크놀러지',
  phone: '010-7707-5915',
};

/* ------------------------------------------------------------------ */

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

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
  return toBase64(new Uint8Array(bits));
}

/* ------------------------------------------------------------------ */

export function isUnlocked(): boolean {
  if (!isLockEnabled()) return true;
  try {
    // 해시를 저장해 둡니다. 번호를 바꾸면 해시가 달라지므로 예전에 푼 기기도
    // 다시 묻게 됩니다 — 번호를 바꾸는 의미가 살아납니다.
    return localStorage.getItem(UNLOCK_STORAGE_KEY) === PASSCODE_HASH;
  } catch {
    // 저장소가 막힌 브라우저(사파리 프라이빗 등) — 이번 세션에서만 풀립니다.
    return false;
  }
}

/** 번호가 맞으면 기기에 기억하고 true 를 돌려줍니다. */
export async function tryUnlock(input: string): Promise<boolean> {
  const trimmed = input.trim();
  if (!trimmed) return false;

  let hash: string;
  try {
    hash = await derive(trimmed);
  } catch {
    // crypto.subtle 은 보안 컨텍스트(HTTPS·localhost)에서만 동작합니다.
    return false;
  }

  if (hash !== PASSCODE_HASH) return false;

  try {
    localStorage.setItem(UNLOCK_STORAGE_KEY, PASSCODE_HASH);
  } catch {
    /* 저장이 막혀도 이번 세션에서는 쓸 수 있습니다 */
  }
  return true;
}

export function relock(): void {
  try {
    localStorage.removeItem(UNLOCK_STORAGE_KEY);
  } catch {
    /* 무시 */
  }
}
