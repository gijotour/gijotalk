// 오디오 오프라인 저장.
//
// 서비스 워커의 fetch 핸들러는 `caches.match(request)` 를 캐시 이름 없이 호출하므로
// CacheStorage 안의 "모든" 캐시를 뒤집니다. 그래서 페이지가 자기 캐시에 미리 넣어두면
// 서비스 워커가 그대로 꺼내 씁니다. SW 와 캐시 이름을 맞출 필요가 없습니다.

import { AUDIO_FILES, AUDIO_BASE } from '../data/audioManifest';
import { CountryId } from '../types';

const AUDIO_CACHE = 'gijo-audio-v1';

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
  if (!('caches' in window) || urls.length === 0) {
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
  if (!('caches' in window)) {
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
          if (res.ok) await cache.put(url, res.clone());
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
  if (!('caches' in window)) return;
  await caches.delete(AUDIO_CACHE);
}

/** 대략적인 다운로드 용량 (문장당 평균 16KB 기준) */
export function estimatedSizeMB(countryId: CountryId): string {
  const mb = (audioUrlsFor(countryId).length * 16) / 1024;
  return mb < 1 ? `${Math.round(mb * 1024)} KB` : `${mb.toFixed(1)} MB`;
}
