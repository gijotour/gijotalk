import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  track,
  flush,
  isAnalyticsEnabled,
  setAnalyticsEnabled,
  hasSeenNotice,
  markNoticeSeen,
  __resetAnalyticsForTest,
  __getQueueForTest,
} from './analytics';

const mockFetch = () => {
  const fn = vi.fn().mockResolvedValue({ ok: true, status: 204 });
  vi.stubGlobal('fetch', fn);
  return fn;
};

describe('사용 기록 수집', () => {
  beforeEach(() => {
    localStorage.clear();
    __resetAnalyticsForTest();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 204 }));
  });

  afterEach(() => vi.unstubAllGlobals());

  it('기본값은 켜짐이다', () => {
    expect(isAnalyticsEnabled()).toBe(true);
  });

  it('이벤트를 큐에 쌓는다', () => {
    track('phrase_play', { id: 'ph-01' });
    const queue = __getQueueForTest();

    expect(queue).toHaveLength(1);
    expect(queue[0].name).toBe('phrase_play');
    expect(queue[0].props).toEqual({ id: 'ph-01' });
    expect(queue[0].device).toBeTruthy();
    expect(queue[0].at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('기기 ID 는 익명이고 실행 간에 유지된다', () => {
    track('session');
    const first = __getQueueForTest()[0].device;

    __resetAnalyticsForTest();
    track('session');
    const second = __getQueueForTest()[0].device;

    expect(second).toBe(first);
    // 개인정보처럼 보이는 값이 섞이지 않았는지
    expect(first).not.toMatch(/@|\.com|010-/);
  });

  it('껐을 때는 아무것도 쌓지 않는다', () => {
    setAnalyticsEnabled(false);
    expect(isAnalyticsEnabled()).toBe(false);

    track('phrase_play', { id: 'ph-01' });
    track('search_empty', { q: '테스트' });

    expect(__getQueueForTest()).toHaveLength(0);
  });

  /** 껐는데 이전에 쌓인 게 나중에 전송되면 "껐다"는 약속을 어기는 겁니다. */
  it('끄면 아직 안 보낸 기록도 함께 버린다', async () => {
    track('phrase_play', { id: 'ph-01' });
    track('phrase_play', { id: 'ph-02' });
    expect(__getQueueForTest()).toHaveLength(2);

    setAnalyticsEnabled(false);
    expect(__getQueueForTest()).toHaveLength(0);
    expect(localStorage.getItem('gijo_event_queue_v1')).toBeNull();

    const fetchSpy = mockFetch();
    await flush();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('다시 켜면 수집을 재개한다', () => {
    setAnalyticsEnabled(false);
    track('phrase_play');
    expect(__getQueueForTest()).toHaveLength(0);

    setAnalyticsEnabled(true);
    track('phrase_play');
    expect(__getQueueForTest()).toHaveLength(1);
  });

  it('전송에 성공하면 큐를 비운다', async () => {
    const fetchSpy = mockFetch();
    track('billboard_open', { id: 'ph-eme-01' });

    await flush();

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('/api/events');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body).events).toHaveLength(1);
    expect(__getQueueForTest()).toHaveLength(0);
  });

  /** 오프라인 앱이므로 현지에서 쌓인 기록이 귀국 후에 도착해야 합니다. */
  it('전송에 실패하면 큐에 남겨 다음 기회에 다시 보낸다', async () => {
    const fetchSpy = vi.fn().mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', fetchSpy);

    track('search_empty', { q: '약국' });
    await flush();

    expect(__getQueueForTest()).toHaveLength(1);

    // 네트워크가 돌아오면 성공
    const ok = mockFetch();
    await flush();
    expect(ok).toHaveBeenCalledOnce();
    expect(__getQueueForTest()).toHaveLength(0);
  });

  it('오프라인이면 전송을 시도하지 않는다', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    const fetchSpy = mockFetch();

    track('phrase_play');
    await flush();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(__getQueueForTest()).toHaveLength(1);
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
  });

  it('오프라인에서 만든 기록에 offline 표시가 붙는다', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    track('session');
    expect(__getQueueForTest()[0].offline).toBe(true);
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
  });

  it('큐가 무한히 자라지 않는다', () => {
    for (let i = 0; i < 300; i++) track('phrase_play', { id: `p-${i}` });
    expect(__getQueueForTest().length).toBeLessThanOrEqual(200);
  });

  it('첫 실행 고지는 한 번만 뜬다', () => {
    expect(hasSeenNotice()).toBe(false);
    markNoticeSeen();
    expect(hasSeenNotice()).toBe(true);
  });
});
