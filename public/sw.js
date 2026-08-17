// GIJO Tour Service Worker — 오프라인 우선 캐싱
//
// 릴리스할 때마다 VERSION 을 올리면 이전 캐시가 자동 정리됩니다.
const VERSION = 'v24';
const SHELL_CACHE = `gijo-shell-${VERSION}`;
const ASSET_CACHE = `gijo-assets-${VERSION}`;
const FONT_CACHE = `gijo-fonts-${VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE, ASSET_CACHE, FONT_CACHE];

// 이 워커가 서빙되는 기준 경로.
// GitHub Pages 는 https://user.github.io/repo/ 처럼 서브패스로 서빙되므로
// 절대경로('/index.html')를 쓰면 저장소 루트를 가리켜 전부 깨집니다.
// sw.js 가 놓인 위치에서 base 를 계산해 어디에 배포하든 동작하게 합니다.
const BASE = new URL('./', self.location.href).pathname; // '/' 또는 '/<저장소이름>/'
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

// 파티 게임(public/game/) — 앱 번들과 무관한 한 장짜리 정적 페이지입니다.
//
// 🔴 아래 fetch 의 '페이지 이동' 분기보다 반드시 먼저 걸러야 합니다. 그 분기는 받아온
//    응답을 앱 셸(index.html)로 덮어쓰는데, 게임 페이지가 거기 들어가면 다음 오프라인
//    실행 때 여행 앱 대신 게임이 뜹니다. iframe 으로 여는 것도 navigate 요청입니다.
const isGamePage = (url) =>
  url.origin === self.location.origin && url.pathname.startsWith(at('game/'));

// 인터넷 없이 게임을 처음 열었을 때. 브라우저 기본 오류 화면 대신 이유를 알려줍니다.
const gameOfflineNotice = () =>
  new Response(
    '<!doctype html><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;' +
      'padding:24px;text-align:center;background:#0a0a0c;color:#fff;' +
      'font-family:system-ui,-apple-system,sans-serif;line-height:1.7">' +
      '<p>게임을 아직 받지 못했습니다.<br>인터넷이 되는 곳에서 한 번만 열어두면<br>' +
      '다음부터는 오프라인에서도 실행됩니다.</p></div>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );

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

// 페이지가 직접 관리하는 캐시. 워커가 건드리면 안 됩니다.
//
// 🔴 예전에는 CURRENT_CACHES 에 없는 캐시를 전부 지웠습니다. 그래서 버전을
//    올릴 때마다 — 즉 배포할 때마다 — 사용자가 "기기에 저장하기" 로 받아둔
//    음성 5MB 가 통째로 날아갔습니다. 출국 전에 받아둔 사람이 현지에서
//    소리가 안 나는 상태가 되는 것이고, 본인은 이유를 알 수 없습니다.
//    이 캐시는 판(revision)이 바뀔 때 페이지가 스스로 갈아치웁니다.
const APP_MANAGED_PREFIX = 'gijo-audio-';

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !CURRENT_CACHES.includes(k) && !k.startsWith(APP_MANAGED_PREFIX))
            .map((k) => caches.delete(k))
        )
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

  // 0) 파티 게임: 캐시 우선. 한 번 열어두면 인터넷 없이도 실행됩니다.
  //    HTML 한 장 + 그림 두 장이 1.8MB 라 설치 때 미리 받지 않습니다. 여행 첫날
  //    데이터로 받게 하는 대신, 열어본 사람에게만 저장해 둡니다.
  //    게임을 새 판으로 갈 때는 맨 위 VERSION 을 올리면 캐시가 통째로 정리됩니다.
  if (isGamePage(url)) {
    event.respondWith(
      caches.match(request).then(async (hit) => {
        if (hit) return hit;
        try {
          const response = await fetch(request);
          if (response && response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        } catch {
          // 그림 하나가 안 받아졌다고 안내문을 그릴 수는 없습니다. 페이지일 때만.
          return request.mode === 'navigate' ? gameOfflineNotice() : Response.error();
        }
      })
    );
    return;
  }

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
