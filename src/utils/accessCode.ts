// 접근 코드 저장/전달.
//
// 지인 배포에서 링크가 유출되면 Gemini 호출 비용이 새므로 AI 엔드포인트에만
// 공유 코드를 겁니다. 친구에게는 https://앱주소/?key=<코드> 로 링크를 보내고,
// 앱은 첫 방문에 그 코드를 저장한 뒤 URL 에서 지웁니다.
//
// 홈 화면에 추가된 PWA 는 start_url 이 "/" 라 ?key= 가 없습니다.
// 그래서 반드시 localStorage 에 남겨둬야 설치 후에도 AI 기능이 계속 동작합니다.

const ACCESS_CODE_KEY = 'gijo_access_code_v1';

/** 앱 시작 시 1회 호출. URL 의 ?key= 를 저장하고 주소창에서 제거합니다. */
export function captureAccessCodeFromUrl(): void {
  try {
    const url = new URL(window.location.href);
    const key = url.searchParams.get('key');
    if (!key) return;

    localStorage.setItem(ACCESS_CODE_KEY, key);

    // 주소창을 깨끗하게 만들어 두면 친구가 링크를 다시 공유할 때
    // 코드가 스크린샷 등으로 새어 나갈 여지가 줄어듭니다.
    url.searchParams.delete('key');
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  } catch {
    /* 저장 실패는 무시 — 코드 없이도 회화 기능은 전부 동작합니다. */
  }
}

export function getAccessCode(): string {
  try {
    return localStorage.getItem(ACCESS_CODE_KEY) || '';
  } catch {
    return '';
  }
}

/** AI 요청에 붙일 헤더 */
export function accessHeaders(): Record<string, string> {
  const code = getAccessCode();
  return code ? { 'x-gijo-key': code } : {};
}
