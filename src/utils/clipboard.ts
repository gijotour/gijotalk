/**
 * 견고한 클립보드 복사 유틸리티 (모바일 WebKit, 인앱 브라우저, HTTP 로컬 테스트 완벽 대응)
 *
 * 1. 최신 navigator.clipboard.writeText 시도
 * 2. 지원하지 않거나 거부된 경우(카카오톡 인앱, iOS 구버전, 비보안 HTTP 등) textarea + execCommand 폴백
 */
export async function copyText(text: string): Promise<boolean> {
  if (!text) return false;

  // 1. Modern Clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 권한 거부 또는 인앱 브라우저 제한 시 fallback으로 계속 진행
    }
  }

  // 2. Legacy fallback via temporary textarea
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // iOS Safari 자동 확대 방지
      textarea.style.fontSize = '16px';
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.width = '2em';
      textarea.style.height = '2em';
      textarea.style.padding = '0';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      textarea.style.opacity = '0';
      textarea.setAttribute('readonly', '');

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return Boolean(successful);
    } catch {
      return false;
    }
  }

  return false;
}
