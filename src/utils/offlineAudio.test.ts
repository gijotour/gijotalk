import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { syncAudioCache } from './offlineAudio';
import { AUDIO_REVISION } from '../data/audioManifest';

/**
 * 저장해 둔 음성을 새 판으로 갈아치우는 규칙.
 *
 * 핵심은 순서입니다 — 먼저 지우면 안 됩니다.
 * 지우고 나서 받는 방식이면 그 사이에 인터넷이 끊긴 사람은 음성이 통째로
 * 사라집니다. 현지에서 쓰는 앱이라 "목소리가 조금 옛것" 보다 훨씬 나쁩니다.
 */

const CURRENT = `gijo-audio-${AUDIO_REVISION}`;
const STALE = 'gijo-audio-oldrev';

/** 아주 단순한 가짜 CacheStorage */
function fakeCaches() {
  const store = new Map<string, Map<string, Response>>();

  const api = {
    store,
    async keys() {
      return [...store.keys()];
    },
    async delete(name: string) {
      return store.delete(name);
    },
    async open(name: string) {
      if (!store.has(name)) store.set(name, new Map());
      const entries = store.get(name)!;
      return {
        async keys() {
          // jsdom 의 Request 는 절대 URL 만 받습니다. 실제 CacheStorage 가
          // 돌려주는 것과 같은 모양(url 이 절대경로)으로 맞춥니다.
          return [...entries.keys()].map((url) => ({
            url: new URL(url, 'http://localhost/').href,
          })) as unknown as Request[];
        },
        async match(url: string) {
          return entries.get(String(url));
        },
        async put(url: string, res: Response) {
          entries.set(String(url), res);
        },
      };
    },
  };
  return api;
}

let cachesApi: ReturnType<typeof fakeCaches>;

const seedStale = (urls: string[]) => {
  const m = new Map<string, Response>();
  urls.forEach((u) => m.set(u, new Response('old')));
  cachesApi.store.set(STALE, m);
};

beforeEach(() => {
  cachesApi = fakeCaches();
  vi.stubGlobal('caches', cachesApi);
  vi.stubGlobal('fetch', vi.fn(async () => new Response('new-audio', { status: 200 })));
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('저장한 음성 갈아치우기', () => {
  it('갈아치울 게 없으면 아무것도 하지 않는다', async () => {
    expect(await syncAudioCache()).toBe('nothing');
  });

  it('🔴 오프라인이면 옛 음성을 지우지 않는다', async () => {
    // 지워버리면 비행기 안·현지에서 음성이 통째로 사라집니다.
    seedStale(['/gijotlak/audio/en/en-tur-01.m4a']);
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });

    expect(await syncAudioCache()).toBe('skipped');
    expect(cachesApi.store.has(STALE)).toBe(true);
  });

  it('데이터 절약 모드에서는 몰래 받지 않는다', async () => {
    seedStale(['/gijotlak/audio/en/en-tur-01.m4a']);
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });

    expect(await syncAudioCache()).toBe('skipped');
    expect(cachesApi.store.has(STALE)).toBe(true);
    Object.defineProperty(navigator, 'connection', { configurable: true, value: undefined });
  });

  it('느린 회선에서도 받지 않는다', async () => {
    seedStale(['/gijotlak/audio/en/en-tur-01.m4a']);
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { effectiveType: '2g' },
    });

    expect(await syncAudioCache()).toBe('skipped');
    expect(cachesApi.store.has(STALE)).toBe(true);
    Object.defineProperty(navigator, 'connection', { configurable: true, value: undefined });
  });

  it('🔴 받기에 실패하면 옛 음성을 남겨둔다', async () => {
    seedStale(['/gijotlak/audio/en/en-tur-01.m4a']);
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 500 })));

    expect(await syncAudioCache()).toBe('skipped');
    expect(cachesApi.store.has(STALE)).toBe(true);
  });

  it('다 받은 뒤에야 옛 음성을 지운다', async () => {
    seedStale(['/gijotlak/audio/en/en-tur-01.m4a']);

    expect(await syncAudioCache()).toBe('updated');
    expect(cachesApi.store.has(STALE)).toBe(false);
    // 새 판 캐시에 실제로 받아둔 것이 있어야 합니다.
    expect((cachesApi.store.get(CURRENT)?.size ?? 0)).toBeGreaterThan(0);
  });

  it('저장하지 않았던 언어까지 새로 받지는 않는다', async () => {
    // 영어만 저장해 뒀다면 타갈로그 160개를 몰래 받으면 안 됩니다.
    seedStale(['/gijotlak/audio/en/en-tur-01.m4a']);
    await syncAudioCache();

    const urls = [...(cachesApi.store.get(CURRENT)?.keys() ?? [])];
    expect(urls.length).toBeGreaterThan(0);
    expect(urls.every((u) => u.includes('/audio/en/'))).toBe(true);
  });

  it('빈 껍데기 캐시는 받을 것 없이 치운다', async () => {
    cachesApi.store.set(STALE, new Map());
    expect(await syncAudioCache()).toBe('nothing');
    expect(cachesApi.store.has(STALE)).toBe(false);
  });
});

/**
 * 저장한 음성이 살아남아야 하는 상황들.
 *
 * 이 앱에서 오프라인 음성이 사라지는 것은 가장 나쁜 고장입니다 —
 * 현지에 도착해서 재생을 눌러야 비로소 알게 되고, 그때는 고칠 방법이 없습니다.
 */
describe('저장한 음성이 사라지지 않아야 하는 경우', () => {
  it('🔴 서비스워커 캐시 정리 규칙이 오디오 캐시를 건드리지 않는다', async () => {
    // sw.js 는 CURRENT_CACHES 에 없는 캐시를 지웁니다. 예전에는 여기에
    // gijo-audio-* 도 걸려서, 배포할 때마다(=버전을 올릴 때마다) 사용자가
    // 받아둔 5MB 가 통째로 날아갔습니다.
    const fs = await import('node:fs');
    const path = await import('node:path');
    const sw = fs.readFileSync(path.join(process.cwd(), 'public', 'sw.js'), 'utf8');

    expect(sw).toContain("APP_MANAGED_PREFIX = 'gijo-audio-'");
    expect(sw).toMatch(/!k\.startsWith\(APP_MANAGED_PREFIX\)/);
  });

  it('오디오 판이 그대로면 다시 받지 않는다', async () => {
    // 앱을 열 때마다 5MB 를 다시 받으면 현지 데이터가 녹습니다.
    cachesApi.store.set(`gijo-audio-${AUDIO_REVISION}`, new Map());
    const spy = vi.fn(async () => new Response('x', { status: 200 }));
    vi.stubGlobal('fetch', spy);

    expect(await syncAudioCache()).toBe('nothing');
    expect(spy).not.toHaveBeenCalled();
  });
});
