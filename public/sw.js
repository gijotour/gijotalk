// GIJO Talk Service Worker — 오프라인 우선 캐싱
//
// 릴리스할 때마다 VERSION 을 올리면 이전 캐시가 자동 정리됩니다.
const VERSION = 'v3';
const SHELL_CACHE = `gijo-shell-${VERSION}`;
const ASSET_CACHE = `gijo-assets-${VERSION}`;
const FONT_CACHE = `gijo-fonts-${VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE, ASSET_CACHE, FONT_CACHE];

// 이 워커가 서빙되는 기준 경로.
// GitHub Pages 는 https://user.github.io/repo/ 처럼 서브패스로 서빙되므로
// 절대경로('/index.html')를 쓰면 저장소 루트를 가리켜 전부 깨집니다.
// sw.js 가 놓인 위치에서 base 를 계산해 어디에 배포하든 동작하게 합니다.
const BASE = new URL('./', self.location.href).pathname; // '/' 또는 '/gijotlak/'
const at = (path) => BASE + path;

// 빌드 산출물(assets/*.js)은 파일명에 해시가 붙어 이름을 미리 알 수 없으므로
// 여기서는 셸만 프리캐시하고, 해시 자산은 최초 방문 시 런타임에 캐시합니다.
const SHELL_ASSETS = [
  at(''),
  at('index.html'),
  at('manifest.json'),
  at('icon-180.png'),
  at('icon-192.png'),
  at('icon-512.png'),
];

const isFontRequest = (url) =>
  url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

// 해시가 박힌 불변 자산 — 한 번 받으면 다시 받을 필요가 없습니다.
const isImmutableAsset = (url) =>
  url.origin === self.location.origin &&
  (url.pathname.startsWith(at('assets/')) || url.pathname.startsWith(at('audio/')));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(async (cache) => {
      // addAll 은 원자적이라 하나만 실패해도 설치 전체가 실패합니다.
      // 개별 add + catch 로 바꿔 일부가 없어도 SW 는 정상 설치되도록 합니다.
      await Promise.all(
        SHELL_ASSETS.map((path) =>
          cache.add(new Request(path, { cache: 'reload' })).catch((err) => {
            console.warn('[SW] 프리캐시 건너뜀:', path, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !CURRENT_CACHES.includes(k)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // API 응답은 절대 캐시하지 않습니다 (AI 생성 결과 / Drive / Firebase).
  if (url.origin === self.location.origin && url.pathname.startsWith(at('api/'))) return;
  if (url.hostname.endsWith('googleapis.com') && !isFontRequest(url)) return;
  if (url.hostname.endsWith('firebaseapp.com')) return;

  // 1) 페이지 이동: 네트워크 우선, 실패하면 캐시된 셸로 폴백 (오프라인 실행)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(at('index.html'), copy));
          return response;
        })
        .catch(async () => (await caches.match(at('index.html'))) || Response.error())
    );
    return;
  }

  // 2) 해시 자산 · 오디오 · 웹폰트: 캐시 우선 (오프라인의 핵심)
  if (isImmutableAsset(url) || isFontRequest(url)) {
    const cacheName = isFontRequest(url) ? FONT_CACHE : ASSET_CACHE;
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            // 폰트는 cross-origin 이라 opaque 응답일 수 있습니다. 그대로 캐시합니다.
            if (response && (response.ok || response.type === 'opaque')) {
              const copy = response.clone();
              caches.open(cacheName).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  // 3) 그 외 동일 출처 요청: 네트워크 우선, 실패 시 캐시
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || Response.error())
    );
  }
});
