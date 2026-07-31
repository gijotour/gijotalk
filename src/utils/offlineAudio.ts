// 오디오 오프라인 저장.
//
// 서비스 워커의 fetch 핸들러는 `caches.match(request)` 를 캐시 이름 없이 호출하므로
// CacheStorage 안의 "모든" 캐시를 뒤집니다. 그래서 페이지가 자기 캐시에 미리 넣어두면
// 서비스 워커가 그대로 꺼내 씁니다. SW 와 캐시 이름을 맞출 필요가 없습니다.

import { AUDIO_FILES, AUDIO_BASE, AUDIO_REVISION } from '../data/audioManifest';
import { CountryId } from '../types';

/**
 * 캐시 이름에 오디오 판 번호를 넣습니다.
 *
 * ⚠️ 예전에는 'gijo-audio-v1' 로 고정돼 있었습니다. 파일 이름은 그대로인 채
 *    내용만 바뀌는 일이 잦은데(음성 교체·EQ 조정), 그러면 기기에 저장해 둔
 *    옛 오디오가 그대로 재생됐습니다. 실제로 영어 음성을 바꾼 뒤에도 저장해
 *    두었던 분들에게는 옛 목소리가 계속 나왔습니다.
 *
 *    서비스워커의 caches.match 는 캐시 이름 없이 "모든" 캐시를 뒤지기 때문에,
 *    낡은 캐시가 하나라도 남아 있으면 그쪽이 이깁니다. 이름을 바꾸는 것만으로는
 *    부족하고 옛 캐시를 지워야 합니다(pruneStaleAudioCaches).
 */
const AUDIO_CACHE = `gijo-audio-${AUDIO_REVISION}`;

const isStale = (name: string) => name.startsWith('gijo-audio-') && name !== AUDIO_CACHE;

/**
 * 저장해 둔 오디오를 새 판으로 갈아치웁니다.
 *
 * ⚠️ 순서가 중요합니다 — 먼저 지우면 안 됩니다.
 *    지우고 나서 받는 방식이면, 그 사이에 인터넷이 끊긴 사람은 음성이 통째로
 *    사라집니다. 현지에서 쓰는 앱이라 이건 목소리가 조금 옛것인 것보다 훨씬
 *    나쁩니다. 그래서 새 판을 다 받은 뒤에야 옛것을 지웁니다.
 *
 * ── 언제 건너뛰는가
 *   · 오프라인 — 옛 음성이라도 나오는 게 낫습니다.
 *   · 데이터 절약 모드·느린 회선 — 현지 데이터로 수 MB 를 몰래 받으면 안 됩니다.
 *     이 경우 옛 캐시를 남겨두므로 다음에 Wi-Fi 에서 자동으로 갱신됩니다.
 */
export async function syncAudioCache(): Promise<'nothing' | 'skipped' | 'updated'> {
  if (!('caches' in globalThis)) return 'nothing';

  try {
    const stale = (await caches.keys()).filter(isStale);
    if (stale.length === 0) return 'nothing';

    if (typeof navigator !== 'undefined' && !navigator.onLine) return 'skipped';

    const conn = (navigator as unknown as {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    if (conn?.saveData) return 'skipped';
    if (conn?.effectiveType && ['slow-2g', '2g'].includes(conn.effectiveType)) return 'skipped';

    // 옛 캐시에 어떤 언어를 저장해 뒀는지 알아내, 그 언어만 다시 받습니다.
    // 저장하지도 않은 언어를 새로 받아버리면 쓰지도 않을 데이터를 쓰게 됩니다.
    const saved = new Set<CountryId>();
    for (const name of stale) {
      const cache = await caches.open(name);
      for (const req of await cache.keys()) {
        const lang = new URL(req.url).pathname.split('/audio/')[1]?.split('/')[0];
        if (lang) saved.add(lang as CountryId);
      }
    }
    if (saved.size === 0) {
      // 비어 있는 껍데기 캐시였습니다. 그냥 치웁니다.
      await Promise.all(stale.map((n) => caches.delete(n)));
      return 'nothing';
    }

    for (const lang of saved) {
      const status = await downloadAudioForOffline(lang);
      // 하나라도 덜 받았으면 옛 캐시를 남겨둡니다. 다음 기회에 다시 시도합니다.
      if (!status.complete) return 'skipped';
    }

    await Promise.all(stale.map((n) => caches.delete(n)));
    return 'updated';
  } catch {
    return 'skipped';
  }
}

/** 해당 언어의 오디오 URL 목록 */
export function audioUrlsFor(countryId: CountryId): string[] {
  return Object.entries(AUDIO_FILES)
    .filter(([, rel]) => rel.startsWith(`${countryId}/`))
    .map(([, rel]) => `${AUDIO_BASE}/${rel}`);
}

export interface OfflineStatus {
  total: number;
  cached: number;
  /** 전부 저장되어 오프라인에서 완전히 재생 가능한 상태 */
  complete: boolean;
}

export async function getOfflineStatus(countryId: CountryId): Promise<OfflineStatus> {
  const urls = audioUrlsFor(countryId);
  if (!('caches' in globalThis) || urls.length === 0) {
    return { total: urls.length, cached: 0, complete: false };
  }

  try {
    const cache = await caches.open(AUDIO_CACHE);
    const keys = await cache.keys();
    const have = new Set(keys.map((r) => new URL(r.url).pathname));
    const cached = urls.filter((u) => have.has(u)).length;
    return { total: urls.length, cached, complete: cached >= urls.length };
  } catch {
    return { total: urls.length, cached: 0, complete: false };
  }
}

/**
 * 해당 언어의 오디오를 전부 내려받아 캐시에 넣습니다.
 * addAll 은 하나만 실패해도 전체가 롤백되므로 개별로 받습니다.
 */
export async function downloadAudioForOffline(
  countryId: CountryId,
  onProgress?: (done: number, total: number) => void
): Promise<OfflineStatus> {
  const urls = audioUrlsFor(countryId);
  if (!('caches' in globalThis)) {
    return { total: urls.length, cached: 0, complete: false };
  }

  const cache = await caches.open(AUDIO_CACHE);
  let done = 0;
  let ok = 0;

  // 동시 요청을 6개로 제한합니다. 현지 저속 네트워크에서 한꺼번에 던지면 오히려 느려집니다.
  const queue = [...urls];
  const workers = Array.from({ length: Math.min(6, queue.length) }, async () => {
    for (;;) {
      const url = queue.shift();
      if (!url) return;
      try {
        if (!(await cache.match(url))) {
          const res = await fetch(url, { cache: 'reload' });
          // ⚠️ 응답이 실패면 성공으로 세면 안 됩니다.
          //    예전에는 res.ok 가 false 여도 ok++ 를 했습니다. 그래서 한 개도
          //    못 받았는데 화면에는 "저장 완료" 가 떴고, 현지에서 재생을 눌러야
          //    비로소 없다는 걸 알게 됐습니다.
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          await cache.put(url, res.clone());
        }
        ok++;
      } catch {
        /* 개별 실패는 넘어갑니다 — 나중에 다시 시도할 수 있습니다. */
      } finally {
        done++;
        onProgress?.(done, urls.length);
      }
    }
  });

  await Promise.all(workers);
  return { total: urls.length, cached: ok, complete: ok >= urls.length };
}

export async function clearOfflineAudio(): Promise<void> {
  if (!('caches' in globalThis)) return;
  await caches.delete(AUDIO_CACHE);
}

/** 대략적인 다운로드 용량 (문장당 평균 16KB 기준) */
export function estimatedSizeMB(countryId: CountryId): string {
  const mb = (audioUrlsFor(countryId).length * 16) / 1024;
  return mb < 1 ? `${Math.round(mb * 1024)} KB` : `${mb.toFixed(1)} MB`;
}
