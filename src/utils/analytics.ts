// 사용 기록 수집.
//
// ── 왜 이 5가지만 모으는가
//   지인 수십 명 규모에서 DAU·체류시간 같은 지표는 전부 노이즈입니다.
//   여기서 목표는 대시보드가 아니라 "다음에 뭘 고칠지 아는 것" 하나입니다.
//
//     search_empty   검색했는데 결과 0  → 다음에 추가할 문장을 정확히 알려줍니다 (가장 값짐)
//     ai_question    AI에 물어본 상황    → 자주 나오면 기본 문장으로 승격
//     phrase_play    문장별 재생 횟수    → 실전에서 쓰이는 문장 vs 채워넣은 문장
//     billboard_open 전광판 실행         → 앱의 핵심 컨셉이 실제로 쓰였는지
//     session        실행 + 오프라인 여부 → 현지에서 실제로 열었는지 (진짜 성공 지표)
//
// ── 프라이버시
//   · 익명 기기 ID만 씁니다. 계정·위치·연락처는 수집하지 않습니다.
//   · 사용자가 언제든 끌 수 있고, 끄면 쌓인 것도 함께 버립니다.
//   · 오프라인 우선 앱이라 이벤트는 로컬에 모았다가 온라인일 때 보냅니다.

import { accessHeaders } from './accessCode';

const DEVICE_ID_KEY = 'gijo_device_id_v1';
const OPT_OUT_KEY = 'gijo_analytics_opt_out_v1';
const QUEUE_KEY = 'gijo_event_queue_v1';
const NOTICE_KEY = 'gijo_analytics_notice_seen_v1';

const MAX_QUEUE = 200;
const FLUSH_DELAY_MS = 4000;

export type EventName =
  | 'search_empty'
  | 'ai_question'
  | 'phrase_play'
  | 'billboard_open'
  | 'session';

export interface GijoEvent {
  name: EventName;
  at: string;
  /** 익명 기기 식별자 — 같은 사람의 이벤트를 묶기 위한 용도뿐입니다 */
  device: string;
  offline: boolean;
  props?: Record<string, string | number | boolean>;
}

/* ------------------------------------------------------------------ */
/* 켜고 끄기                                                            */
/* ------------------------------------------------------------------ */

export function isAnalyticsEnabled(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) !== '1';
  } catch {
    return false;
  }
}

export function setAnalyticsEnabled(enabled: boolean): void {
  try {
    if (enabled) {
      localStorage.removeItem(OPT_OUT_KEY);
    } else {
      localStorage.setItem(OPT_OUT_KEY, '1');
      // 끄면 아직 안 보낸 것도 버립니다. 남겨두면 "껐는데 왜 보내지" 가 됩니다.
      localStorage.removeItem(QUEUE_KEY);
      queue.length = 0;
    }
  } catch {
    /* 저장 실패는 무시 */
  }
}

export function hasSeenNotice(): boolean {
  try {
    return localStorage.getItem(NOTICE_KEY) === '1';
  } catch {
    return true;
  }
}

export function markNoticeSeen(): void {
  try {
    localStorage.setItem(NOTICE_KEY, '1');
  } catch {
    /* noop */
  }
}

/* ------------------------------------------------------------------ */
/* 익명 기기 ID                                                         */
/* ------------------------------------------------------------------ */

function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `d-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return 'anonymous';
  }
}

/* ------------------------------------------------------------------ */
/* 큐                                                                  */
/* ------------------------------------------------------------------ */

let queue: GijoEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function loadQueue(): void {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    queue = Array.isArray(parsed) ? parsed : [];
  } catch {
    queue = [];
  }
}

function saveQueue(): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE)));
  } catch {
    /* 저장 공간이 없으면 그냥 포기합니다 — 기록보다 앱 동작이 우선입니다 */
  }
}

/* ------------------------------------------------------------------ */
/* 기록 · 전송                                                          */
/* ------------------------------------------------------------------ */

export function track(name: EventName, props?: GijoEvent['props']): void {
  if (!isAnalyticsEnabled()) return;

  queue.push({
    name,
    at: new Date().toISOString(),
    device: getDeviceId(),
    offline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    props,
  });

  if (queue.length > MAX_QUEUE) queue = queue.slice(-MAX_QUEUE);
  saveQueue();
  scheduleFlush();
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, FLUSH_DELAY_MS);
}

export async function flush(): Promise<void> {
  if (!isAnalyticsEnabled()) return;
  if (queue.length === 0) return;
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;

  const batch = queue.slice(0, MAX_QUEUE);
  try {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...accessHeaders() },
      body: JSON.stringify({ events: batch }),
      keepalive: true,
    });
    if (!res.ok) return; // 실패하면 큐에 남겨 다음 기회에 다시 보냅니다
    queue = queue.slice(batch.length);
    saveQueue();
  } catch {
    /* 오프라인이거나 서버가 없으면 조용히 다음으로 미룹니다 */
  }
}

/* ------------------------------------------------------------------ */
/* 초기화                                                              */
/* ------------------------------------------------------------------ */

let started = false;

/** 앱 시작 시 한 번 호출합니다. */
export function initAnalytics(): void {
  if (started || typeof window === 'undefined') return;
  started = true;

  loadQueue();
  track('session', {
    standalone:
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true,
  });

  // 온라인으로 돌아오면 밀린 것을 보냅니다. 현지에서 쌓인 기록이 귀국 후 도착합니다.
  window.addEventListener('online', () => void flush());

  // 앱을 닫을 때 마지막으로 한 번 시도합니다.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flush();
  });
}

/** 테스트용 — 모듈 상태를 되돌립니다. */
export function __resetAnalyticsForTest(): void {
  started = false;
  queue = [];
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
}

export function __getQueueForTest(): GijoEvent[] {
  return queue;
}
