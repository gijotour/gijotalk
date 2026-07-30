// PWA 설치 · 오프라인 · 북마크 저장 유틸리티

const BOOKMARKS_STORAGE_KEY = 'quickpass_bookmarks_v1';
export const CUSTOM_PHRASES_STORAGE_KEY = 'quickpass_custom_phrases_v1';

/* ------------------------------------------------------------------ */
/* 서비스 워커                                                          */
/* ------------------------------------------------------------------ */

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (process.env.NODE_ENV !== 'production') return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[GIJO Talk] 오프라인 캐시 준비됨:', reg.scope);
      })
      .catch((err) => {
        console.warn('[GIJO Talk] 서비스 워커 등록 실패:', err);
      });
  });
}

/* ------------------------------------------------------------------ */
/* 북마크 (localStorage)                                                */
/* ------------------------------------------------------------------ */

export function getSavedBookmarkIds(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

/** 북마크 목록을 저장합니다. 저장 경로를 여기 하나로 모아 키가 어긋나지 않게 합니다. */
export function saveBookmarkIds(ids: string[]): void {
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(ids));
  } catch (e) {
    console.warn('북마크 저장 실패:', e);
  }
}

/**
 * 북마크를 토글합니다.
 * localStorage 를 다시 읽지 않고 호출자가 넘긴 현재 목록을 기준으로 동작합니다.
 * (Drive 복원 직후 토글하면 복원 결과가 통째로 날아가던 문제를 막습니다.)
 */
export function toggleBookmarkId(phraseId: string, current: string[]): string[] {
  const updated = current.includes(phraseId)
    ? current.filter((id) => id !== phraseId)
    : [...current, phraseId];
  saveBookmarkIds(updated);
  return updated;
}

/* ------------------------------------------------------------------ */
/* 온라인 / 오프라인                                                     */
/* ------------------------------------------------------------------ */

export function isBrowserOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/* ------------------------------------------------------------------ */
/* 설치 상태 감지                                                        */
/* ------------------------------------------------------------------ */

/** 홈 화면에서 실행 중인지 (= 설치 완료). iOS 는 navigator.standalone 을 씁니다. */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function isIOS(): boolean {
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS 13+ 는 데스크톱 사파리로 위장합니다.
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/**
 * 카카오톡·인스타그램 등 인앱 브라우저 여부.
 *
 * 지인 배포에서 제일 흔한 실패 원인입니다. 인앱 브라우저에서는
 *  - "홈 화면에 추가" 메뉴가 아예 없고
 *  - Firebase 팝업 로그인(Drive 백업)이 차단됩니다.
 */
export function isInAppBrowser(): boolean {
  const ua = navigator.userAgent || '';
  return /KAKAOTALK|FBAN|FBAV|FB_IAB|Instagram|Line\/|NAVER|DaumApps|Snapchat|Twitter/i.test(ua);
}

export function isKakaoTalk(): boolean {
  return /KAKAOTALK/i.test(navigator.userAgent || '');
}

/* ------------------------------------------------------------------ */
/* 안드로이드 설치 프롬프트                                               */
/* ------------------------------------------------------------------ */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<(available: boolean) => void>();

const notify = (available: boolean) => promptListeners.forEach((fn) => fn(available));

if (typeof window !== 'undefined') {
  // 모듈 로드 시점에 등록해야 이벤트를 놓치지 않습니다.
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notify(true);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notify(false);
  });
}

export function canPromptInstall(): boolean {
  return deferredPrompt !== null;
}

export function onInstallAvailabilityChange(cb: (available: boolean) => void): () => void {
  promptListeners.add(cb);
  return () => promptListeners.delete(cb);
}

/** 안드로이드 크롬의 네이티브 설치 시트를 띄웁니다. */
export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) return 'unavailable';
  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notify(false);
    return outcome;
  } catch {
    return 'unavailable';
  }
}
