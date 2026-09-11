import { useCallback, useEffect, useRef, useState } from 'react';
import type { Country } from '../types';
import { COUNTRIES } from '../config';
import { playPhrase, stopAllPlayback, unlockAudioPlayback } from '../utils/speech';
import { vocabAsPhrase, vocabPrimaryFor, type VocabItem } from '../utils/vocab';

/**
 * 어휘 항목 재생.
 *
 * 어휘 전용 재생기를 새로 만들지 않고 `vocabAsPhrase` 로 Phrase 를 만들어
 * 기존 `playPhrase` 에 넘깁니다 — 녹음 파일 우선·TTS 폴백·iOS 오디오 잠금 해제가
 * 전부 그쪽에 이미 들어 있습니다.
 */
export function useVocabAudio(country: Country, speed: number) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      // 화면을 떠나면 소리도 따라 나가야 합니다.
      stopAllPlayback();
    };
  }, []);

  const play = useCallback(
    (item: VocabItem, onEnd?: () => void) => {
      unlockAudioPlayback();
      const phrase = vocabAsPhrase(item, vocabPrimaryFor(country.id));
      // 영어 트랙 항목은 en 목소리로 읽어야 합니다 — langCode 가 다릅니다.
      const voiceCountry = COUNTRIES.find((c) => c.id === phrase.countryId) ?? country;
      setPlayingId(item.id);

      const finish = () => {
        if (!aliveRef.current) return;
        setPlayingId(null);
        onEnd?.();
      };

      playPhrase({
        phrase,
        country: voiceCountry,
        rate: speed,
        onEnd: finish,
        onError: finish,
      });
    },
    [country, speed]
  );

  const stop = useCallback(() => {
    stopAllPlayback();
    setPlayingId(null);
  }, []);

  return { playingId, play, stop };
}
