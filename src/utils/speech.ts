// 통합 음성 재생 계층.
//
// 사전 생성된 오디오 파일이 있으면 그걸 쓰고, 없으면(=AI가 방금 만든 문장 등)
// 브라우저 TTS 로 넘어갑니다.
//
// 오디오 파일을 우선하는 이유:
//   · 타갈로그(tl-PH)는 브라우저 내장 음성이 아예 없습니다.
//   · iOS 홈화면 PWA 에서 speechSynthesis 는 무음 실패가 잦습니다.
//   · <audio> + Media Session 이라야 화면을 끄고도 재생이 이어집니다.
//   · 서비스 워커가 캐시하므로 완전 오프라인에서 동작합니다.

import { Phrase, Country } from '../types';
import { audioUrlFor, hasRecordedAudio } from '../data/audioManifest';
import { speakPhrase } from './audio';

export { hasRecordedAudio };

interface PlayOptions {
  phrase: Phrase;
  country: Country;
  rate?: number;
  onEnd?: () => void;
  onError?: () => void;
}

/* ------------------------------------------------------------------ */
/* 공유 오디오 엘리먼트                                                  */
/* ------------------------------------------------------------------ */

// iOS 는 "사용자 제스처 안에서 한 번 play() 된 엘리먼트"만 이후 자유롭게 재생할 수 있습니다.
// 그래서 엘리먼트를 매번 새로 만들지 않고 하나를 계속 재사용합니다.
let sharedAudio: HTMLAudioElement | null = null;
let unlocked = false;
let generation = 0;

function getAudioElement(): HTMLAudioElement {
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = 'auto';
    sharedAudio.setAttribute('playsinline', 'true');
  }
  return sharedAudio;
}

/**
 * 첫 사용자 터치에서 호출해 iOS 오디오 잠금을 풉니다.
 * 무음 재생을 한 번 시켜 두면 이후 자동 재생(전광판 모드 등)이 막히지 않습니다.
 */
export function unlockAudioPlayback(): void {
  if (unlocked) return;
  unlocked = true;
  const el = getAudioElement();
  const prevVolume = el.volume;
  el.volume = 0;
  el.src =
    'data:audio/mp4;base64,AAAAHGZ0eXBNNEEgAAAAAE00QSBtcDQyaXNvbQAAAAhmcmVl';
  el.play()
    .catch(() => {
      /* 잠금 해제 실패는 무시 — 다음 재생 시 다시 시도됩니다. */
    })
    .finally(() => {
      el.pause();
      el.volume = prevVolume;
    });
}

/* ------------------------------------------------------------------ */
/* 재생 / 정지                                                          */
/* ------------------------------------------------------------------ */

export function stopAllPlayback(): void {
  generation += 1;
  if (sharedAudio) {
    sharedAudio.pause();
    sharedAudio.onended = null;
    sharedAudio.onerror = null;
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

/**
 * 문장을 재생합니다.
 * 사전 녹음이 있으면 오디오 파일, 없으면 브라우저 TTS 로 자동 폴백합니다.
 */
export function playPhrase({ phrase, country, rate = 1.0, onEnd, onError }: PlayOptions): void {
  stopAllPlayback();
  const myGeneration = generation;

  const url = audioUrlFor(phrase.id);

  // 녹음이 없는 문장(AI 생성 등)은 기존 TTS 경로를 씁니다.
  if (!url) {
    speakPhrase({
      text: phrase.original,
      langCode: country.langCode,
      rate,
      volume: 1.0,
      voiceGender: 'female',
      onEnd: () => {
        if (myGeneration === generation) onEnd?.();
      },
      onError: () => {
        if (myGeneration === generation) onError?.();
      },
    });
    return;
  }

  const el = getAudioElement();
  el.onended = null;
  el.onerror = null;
  el.src = url;
  el.playbackRate = rate;
  el.currentTime = 0;

  el.onended = () => {
    if (myGeneration === generation) onEnd?.();
  };

  el.onerror = () => {
    if (myGeneration !== generation) return;
    // 파일이 깨졌거나 아직 캐시되지 않았다면 TTS 로 떨어뜨립니다.
    speakPhrase({
      text: phrase.original,
      langCode: country.langCode,
      rate,
      volume: 1.0,
      voiceGender: 'female',
      onEnd: () => {
        if (myGeneration === generation) onEnd?.();
      },
      onError: () => {
        if (myGeneration === generation) onError?.();
      },
    });
  };

  el.play().catch(() => {
    if (myGeneration === generation) onError?.();
  });
}

/* ------------------------------------------------------------------ */
/* 잠금화면 / 백그라운드 재생 제어                                        */
/* ------------------------------------------------------------------ */

interface MediaSessionHandlers {
  onNext?: () => void;
  onPrev?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
}

/**
 * 잠금화면·이어폰 버튼 제어를 붙입니다.
 * 이게 있어야 "화면 끄고 이어폰으로 반복 듣기"가 실제로 가능합니다.
 */
export function updateMediaSession(
  phrase: Phrase,
  country: Country,
  handlers: MediaSessionHandlers = {}
): void {
  if (!('mediaSession' in navigator)) return;

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: phrase.original,
      artist: phrase.translation,
      album: `GIJO Talk · ${country.name}`,
      artwork: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    });

    const set = (action: MediaSessionAction, fn?: () => void) => {
      try {
        navigator.mediaSession.setActionHandler(action, fn ? () => fn() : null);
      } catch {
        /* 브라우저가 지원하지 않는 액션은 무시 */
      }
    };

    set('play', handlers.onPlay);
    set('pause', handlers.onPause);
    set('nexttrack', handlers.onNext);
    set('previoustrack', handlers.onPrev);
  } catch {
    /* MediaMetadata 미지원 브라우저 */
  }
}

export function clearMediaSession(): void {
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.metadata = null;
    (['play', 'pause', 'nexttrack', 'previoustrack'] as MediaSessionAction[]).forEach((a) => {
      try {
        navigator.mediaSession.setActionHandler(a, null);
      } catch {
        /* noop */
      }
    });
  } catch {
    /* noop */
  }
}

export function setMediaSessionPlaybackState(state: 'playing' | 'paused' | 'none'): void {
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.playbackState = state;
  } catch {
    /* noop */
  }
}
