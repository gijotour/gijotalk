import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Phrase, Country } from '../types';
import {
  playPhrase,
  stopAllPlayback,
  unlockAudioPlayback,
  updateMediaSession,
  clearMediaSession,
  setMediaSessionPlaybackState,
} from '../utils/speech';

/**
 * 연속 듣기 재생 엔진.
 *
 * 예전에는 이 로직이 ListeningModal 안에 있어서 모달을 닫으면 재생이 끊겼습니다.
 * "비행기·택시에서 이어폰으로 반복 듣기"가 컨셉인데, 목록을 보려면 재생을 멈춰야 하는
 * 구조였던 셈입니다. 엔진을 App 으로 끌어올려 모달과 미니 플레이어가 같은 재생을
 * 공유하도록 했습니다.
 *
 * ⚠️ 재생 상태·설정·목록을 ref 로 읽는 이유:
 *    playPhrase 의 onEnd 콜백은 "등록된 시점의 렌더"에 묶입니다.
 *    state 로 읽으면 값이 영원히 초깃값이라 첫 문장 뒤에 재생이 멈춥니다.
 */

export interface ListeningPlayer {
  phrases: Phrase[];
  country: Country;
  currentIndex: number;
  currentPhrase: Phrase | null;
  isPlaying: boolean;
  /** 한 번이라도 재생한 적이 있는가 — 미니 플레이어 노출 조건 */
  isActive: boolean;
  repeatProgress: number;

  speed: number;
  setSpeed: (v: number) => void;
  repeatCount: number;
  setRepeatCount: (v: number) => void;
  intervalGap: number;
  setIntervalGap: (v: number) => void;

  play: (index?: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
  /** 재생을 멈추고 미니 플레이어까지 닫습니다 */
  dismiss: () => void;
}

export function useListeningPlayer(phrases: Phrase[], country: Country): ListeningPlayer {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [repeatProgress, setRepeatProgress] = useState(1);

  const [speed, setSpeed] = useState(1.0);
  const [repeatCount, setRepeatCount] = useState(2);
  const [intervalGap, setIntervalGap] = useState(2);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);
  const phrasesRef = useRef(phrases);
  const settingsRef = useRef({ speed, repeatCount, intervalGap });

  // speechSynthesis.cancel() 은 브라우저에 따라 직전 발화의 onend 를 뒤늦게 쏩니다.
  // 세대 번호로 "이미 폐기된 발화"의 콜백을 걸러냅니다.
  const generationRef = useRef(0);

  useEffect(() => {
    phrasesRef.current = phrases;
  }, [phrases]);

  useEffect(() => {
    settingsRef.current = { speed, repeatCount, intervalGap };
  }, [speed, repeatCount, intervalGap]);

  const clearPendingTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const stop = useCallback(() => {
    generationRef.current += 1;
    isPlayingRef.current = false;
    stopAllPlayback();
    clearPendingTimer();
    setIsPlaying(false);
    setMediaSessionPlaybackState('paused');
  }, []);

  const dismiss = useCallback(() => {
    stop();
    clearMediaSession();
    setIsActive(false);
    setCurrentIndex(0);
    setRepeatProgress(1);
  }, [stop]);

  // 재귀 호출은 ref 를 통해 최신 구현을 부릅니다.
  const playFromRef = useRef<(index: number, repeat: number) => void>(() => {});

  const playFrom = useCallback(
    (phraseIndex: number, currentRepeat: number) => {
      const list = phrasesRef.current;
      if (!list.length) return;
      const target = list[phraseIndex];
      if (!target) return;

      clearPendingTimer();
      generationRef.current += 1;
      const generation = generationRef.current;
      isPlayingRef.current = true;
      setIsPlaying(true);
      setIsActive(true);
      setCurrentIndex(phraseIndex);
      setRepeatProgress(currentRepeat);

      // 잠금화면·이어폰 버튼 제어. 화면을 꺼도 조작할 수 있게 합니다.
      updateMediaSession(target, country, {
        onNext: () => playFromRef.current((phraseIndex + 1) % phrasesRef.current.length, 1),
        onPrev: () =>
          playFromRef.current(
            (phraseIndex - 1 + phrasesRef.current.length) % phrasesRef.current.length,
            1
          ),
        onPause: () => stop(),
        onPlay: () => playFromRef.current(phraseIndex, 1),
      });
      setMediaSessionPlaybackState('playing');

      playPhrase({
        phrase: target,
        country,
        rate: settingsRef.current.speed,
        onEnd: () => {
          if (!isPlayingRef.current || generation !== generationRef.current) return;
          const { repeatCount: repeats, intervalGap: gap } = settingsRef.current;
          const list2 = phrasesRef.current;
          if (!list2.length) return;

          const nextStep =
            currentRepeat < repeats
              ? { index: phraseIndex, repeat: currentRepeat + 1 }
              : { index: (phraseIndex + 1) % list2.length, repeat: 1 };

          timeoutRef.current = setTimeout(() => {
            if (!isPlayingRef.current || generation !== generationRef.current) return;
            playFromRef.current(nextStep.index, nextStep.repeat);
          }, gap * 1000);
        },
        onError: () => {
          if (generation !== generationRef.current) return;
          stop();
        },
      });
    },
    [country, stop]
  );

  useEffect(() => {
    playFromRef.current = playFrom;
  }, [playFrom]);

  // 재생 목록이 "실제로" 바뀔 때만 처음으로 되돌립니다.
  // phrases 는 매 렌더 새 배열이라 참조 비교를 쓰면 재생 중 되감깁니다.
  const phraseSignature = useMemo(() => phrases.map((p) => p.id).join('|'), [phrases]);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    // 국가를 바꾸거나 카테고리를 바꾸면 재생 목록이 달라지므로 정지하고 되감습니다.
    dismiss();
  }, [phraseSignature, dismiss]);

  useEffect(
    () => () => {
      stop();
      clearMediaSession();
    },
    [stop]
  );

  const play = useCallback(
    (index?: number) => {
      unlockAudioPlayback();
      playFrom(index ?? currentIndex, 1);
    },
    [playFrom, currentIndex]
  );

  const toggle = useCallback(() => {
    unlockAudioPlayback();
    if (isPlayingRef.current) stop();
    else playFrom(currentIndex, 1);
  }, [currentIndex, playFrom, stop]);

  const next = useCallback(() => {
    if (!phrasesRef.current.length) return;
    stop();
    playFrom((currentIndex + 1) % phrasesRef.current.length, 1);
  }, [currentIndex, playFrom, stop]);

  const prev = useCallback(() => {
    const len = phrasesRef.current.length;
    if (!len) return;
    stop();
    playFrom((currentIndex - 1 + len) % len, 1);
  }, [currentIndex, playFrom, stop]);

  return {
    phrases,
    country,
    currentIndex,
    currentPhrase: phrases[currentIndex] ?? phrases[0] ?? null,
    isPlaying,
    isActive,
    repeatProgress,
    speed,
    setSpeed,
    repeatCount,
    setRepeatCount,
    intervalGap,
    setIntervalGap,
    play,
    toggle,
    next,
    prev,
    stop,
    dismiss,
  };
}
