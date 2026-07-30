import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * jsdom 에 없는 브라우저 API 를 채웁니다.
 * 이 앱은 오디오·스피치·캐시 API 에 크게 의존해서 스텁 없이는 아무것도 렌더되지 않습니다.
 */

/** 테스트에서 재생 흐름을 관찰하기 위한 기록 */
export const audioLog: { played: string[]; instances: MockAudio[] } = {
  played: [],
  instances: [],
};

export class MockAudio {
  src = '';
  preload = '';
  volume = 1;
  playbackRate = 1;
  currentTime = 0;
  paused = true;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;

  /** 실제 <audio> 처럼 재생이 "끝나면" onended 를 쏩니다. */
  static PLAY_DURATION_MS = 50;

  constructor(src = '') {
    this.src = src;
    audioLog.instances.push(this);
  }

  setAttribute() {}

  play() {
    // unlockAudioPlayback() 이 쓰는 무음 data URI 는 기록하지 않습니다.
    if (this.src.startsWith('data:')) return Promise.resolve();

    this.paused = false;
    audioLog.played.push(this.src);
    setTimeout(() => {
      if (this.paused) return;
      this.paused = true;
      this.onended?.();
    }, MockAudio.PLAY_DURATION_MS);
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }
}

vi.stubGlobal('Audio', MockAudio);

vi.stubGlobal('speechSynthesis', {
  cancel: vi.fn(),
  speak: vi.fn(),
  getVoices: () => [],
  onvoiceschanged: null,
});

vi.stubGlobal(
  'SpeechSynthesisUtterance',
  class {
    text: string;
    lang = '';
    rate = 1;
    pitch = 1;
    volume = 1;
    voice: unknown = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor(text: string) {
      this.text = text;
    }
  }
);

// Media Session — 잠금화면 제어. jsdom 에 없습니다.
Object.defineProperty(navigator, 'mediaSession', {
  value: { metadata: null, playbackState: 'none', setActionHandler: vi.fn() },
  writable: true,
  configurable: true,
});
vi.stubGlobal(
  'MediaMetadata',
  class {
    constructor(init: unknown) {
      Object.assign(this, init);
    }
  }
);

// Cache API — 오프라인 저장 카드가 씁니다.
vi.stubGlobal('caches', {
  open: async () => ({
    keys: async () => [],
    match: async () => undefined,
    put: async () => {},
    add: async () => {},
  }),
  match: async () => undefined,
  delete: async () => true,
  keys: async () => [],
});

if (!window.matchMedia) {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }));
}

afterEach(() => {
  cleanup();
  audioLog.played.length = 0;
  audioLog.instances.length = 0;
  localStorage.clear();
  document.body.style.overflow = '';
});
