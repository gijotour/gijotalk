import React, { useState, useEffect, useRef } from 'react';
import { Phrase, Country } from '../types';
import { speakPhrase } from '../utils/audio';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  Headphones,
  Sparkles,
  ListMusic,
  Clock,
  Repeat,
} from 'lucide-react';

interface ListeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  phrases: Phrase[];
  country: Country;
  initialSpeed?: number;
}

export const ListeningModal: React.FC<ListeningModalProps> = ({
  isOpen,
  onClose,
  phrases,
  country,
  initialSpeed = 1.0,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(initialSpeed);
  const [repeatCount, setRepeatCount] = useState<number>(2); // 1, 2, or 3 times per phrase
  const [intervalGap, setIntervalGap] = useState<number>(2); // 1s, 2s, 3s pause gap
  const [repeatProgress, setRepeatProgress] = useState<number>(1);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Reset index when phrases array changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setRepeatProgress(1);
      setIsPlaying(false);
    } else {
      stopPlayback();
    }
  }, [isOpen, phrases]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const stopPlayback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPlaying(false);
  };

  const currentPhrase = phrases[currentIndex] || phrases[0];

  const playCurrentPhrase = (phraseIndex: number, currentRepeat: number) => {
    if (!phrases || phrases.length === 0) return;
    const targetPhrase = phrases[phraseIndex];
    if (!targetPhrase) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    speakPhrase({
      text: targetPhrase.original,
      langCode: country.langCode,
      rate: speed,
      volume: 1.0,
      voiceGender: 'female',
      onEnd: () => {
        if (!isPlaying) return;

        if (currentRepeat < repeatCount) {
          // Still need to repeat this phrase
          timeoutRef.current = setTimeout(() => {
            setRepeatProgress(currentRepeat + 1);
            playCurrentPhrase(phraseIndex, currentRepeat + 1);
          }, intervalGap * 1000);
        } else {
          // Advance to next phrase
          const nextIndex = (phraseIndex + 1) % phrases.length;
          timeoutRef.current = setTimeout(() => {
            setCurrentIndex(nextIndex);
            setRepeatProgress(1);
            playCurrentPhrase(nextIndex, 1);
          }, intervalGap * 1000);
        }
      },
      onError: () => {
        setIsPlaying(false);
      },
    });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      setIsPlaying(true);
      playCurrentPhrase(currentIndex, repeatProgress);
    }
  };

  const handleNext = () => {
    stopPlayback();
    const nextIdx = (currentIndex + 1) % phrases.length;
    setCurrentIndex(nextIdx);
    setRepeatProgress(1);
    setIsPlaying(true);
    setTimeout(() => {
      playCurrentPhrase(nextIdx, 1);
    }, 100);
  };

  const handlePrev = () => {
    stopPlayback();
    const prevIdx = (currentIndex - 1 + phrases.length) % phrases.length;
    setCurrentIndex(prevIdx);
    setRepeatProgress(1);
    setIsPlaying(true);
    setTimeout(() => {
      playCurrentPhrase(prevIdx, 1);
    }, 100);
  };

  const handleSelectPhrase = (index: number) => {
    stopPlayback();
    setCurrentIndex(index);
    setRepeatProgress(1);
    setIsPlaying(true);
    setTimeout(() => {
      playCurrentPhrase(index, 1);
    }, 100);
  };

  if (!isOpen || !currentPhrase) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#FF6B4A] to-pink-500 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm shadow-inner">
              <Headphones className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{country.flag}</span>
                <h3 className="font-extrabold text-base tracking-tight">
                  무한 연속 듣기 모드
                </h3>
              </div>
              <p className="text-xs text-white/80 font-medium">
                {country.name} 현지 여성 음성 반복 학습 ({currentIndex + 1} / {phrases.length})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopPlayback();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Main Display Player Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-slate-700/50">
            {/* Background Audio Wave Pulse Effect */}
            {isPlaying && (
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-pink-500/10 animate-pulse pointer-events-none" />
            )}

            {/* Category Badge & Repeat Counter */}
            <div className="flex items-center justify-between mb-4 text-xs">
              <span className="bg-white/10 text-orange-300 font-bold px-3 py-1 rounded-full border border-orange-400/30">
                🏷️ {currentPhrase.category}
              </span>

              <div className="flex items-center gap-2">
                <span className="bg-pink-500/20 text-pink-300 font-bold px-3 py-1 rounded-full border border-pink-400/30 text-[11px] flex items-center gap-1">
                  👩 현지 여성 음성
                </span>
                <span className="bg-white/10 text-white font-mono px-2.5 py-1 rounded-full text-[11px]">
                  반복 {repeatProgress}/{repeatCount}
                </span>
              </div>
            </div>

            {/* Phrase Main Native Text */}
            <div className="min-h-[90px] flex flex-col justify-center my-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-wide leading-relaxed font-sans">
                {currentPhrase.original}
              </h2>
              <p className="text-xl font-black text-pink-200 mt-2">
                {currentPhrase.pronunciation}
              </p>
            </div>

            {/* Korean Translation */}
            <div className="pt-3 border-t border-slate-700/60 flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-slate-200">
                💬 {currentPhrase.translation}
              </p>
            </div>

            {/* Tone/Tip Guide */}
            {currentPhrase.toneGuide && (
              <div className="mt-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{currentPhrase.toneGuide}</span>
              </div>
            )}
          </div>

          {/* Quick Settings Bar: Speed, Repeat, Gap Interval */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Repeat className="w-4 h-4 text-[#FF6B4A]" /> 반복 횟수
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRepeatCount(r)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      repeatCount === r
                        ? 'bg-[#FF6B4A] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {r}회
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Clock className="w-4 h-4 text-[#FF6B4A]" /> 쉬는 간격
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((g) => (
                  <button
                    key={g}
                    onClick={() => setIntervalGap(g)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      intervalGap === g
                        ? 'bg-[#FF6B4A] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {g}초
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Volume2 className="w-4 h-4 text-[#FF6B4A]" /> 재생 속도
              </span>
              <div className="flex gap-1.5">
                {[0.8, 1.0, 1.2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      speed === s
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Playlist Toggle & Scrollable List */}
          <div>
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="w-full flex items-center justify-between p-3 bg-slate-100 hover:bg-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-slate-600" />
                전체 재생목록 ({phrases.length}개)
              </span>
              <span className="text-[11px] text-slate-500">
                {showPlaylist ? '목록 접기 ▲' : '목록 보기 ▼'}
              </span>
            </button>

            {showPlaylist && (
              <div
                ref={listRef}
                className="mt-2 max-h-48 overflow-y-auto space-y-1.5 p-1 border border-slate-200 rounded-2xl bg-white shadow-inner"
              >
                {phrases.map((p, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={p.id || idx}
                      onClick={() => handleSelectPhrase(idx)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-orange-50 border border-orange-300 font-bold text-slate-900 shadow-xs'
                          : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="text-slate-400 mr-2 font-mono text-[10px]">
                          {idx + 1}.
                        </span>
                        <span className="font-bold text-slate-900 mr-2">
                          {p.original}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          ({p.translation})
                        </span>
                      </div>
                      {isActive && isPlaying && (
                        <span className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-ping shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Floating Player Control Buttons Bar */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-center gap-5 shadow-lg">
          <button
            onClick={handlePrev}
            className="p-3 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 rounded-2xl border border-slate-200 shadow-xs transition-transform"
            title="이전 문장"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`p-4 rounded-3xl text-white shadow-lg active:scale-95 transition-all flex items-center justify-center ${
              isPlaying
                ? 'bg-slate-900 shadow-slate-900/30'
                : 'bg-[#FF6B4A] hover:bg-[#e05a3b] shadow-orange-500/30'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-3 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 rounded-2xl border border-slate-200 shadow-xs transition-transform"
            title="다음 문장"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
