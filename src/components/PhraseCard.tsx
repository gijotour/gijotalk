import React, { useState } from 'react';
import { Phrase, Country } from '../types';
import { playPhrase, unlockAudioPlayback, hasRecordedAudio } from '../utils/speech';
import { track } from '../utils/analytics';
import { Volume2, Mic, Maximize2, Bookmark, Info } from 'lucide-react';

interface PhraseCardProps {
  phrase: Phrase;
  country: Country;
  speed: number;
  onSetSpeed: (speed: number) => void;
  isBookmarked: boolean;
  onToggleBookmark: (phraseId: string) => void;
  onOpenBillboard: (phrase: Phrase) => void;
  onOpenMicPractice: (phrase: Phrase) => void;
}

export const PhraseCard: React.FC<PhraseCardProps> = ({
  phrase,
  country,
  speed,
  onSetSpeed,
  isBookmarked,
  onToggleBookmark,
  onOpenBillboard,
  onOpenMicPractice,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔴 로 표시한 강한 욕설은 의도적으로 녹음을 만들지 않았습니다.
  // 공공장소에서 실수로 크게 트는 사고를 막기 위해 재생 버튼도 숨깁니다.
  const isMutedByDesign = phrase.toneGuide?.startsWith('🔴') ?? false;
  const hasAudio = hasRecordedAudio(phrase.id);

  const handleSpeak = () => {
    unlockAudioPlayback();
    track('phrase_play', { id: phrase.id, category: phrase.category, lang: country.id });
    setIsPlaying(true);
    playPhrase({
      phrase,
      country,
      rate: speed,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  return (
    <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 hover:border-brand-vivid shadow-xs relative overflow-hidden group transition-all duration-200">
      {/* Top Meta Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-orange-100 text-brand rounded-xl text-xs font-bold uppercase tracking-wider">
            {phrase.category}
          </span>
          {phrase.toneGuide && (
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-xl font-bold">
              {phrase.toneGuide}
            </span>
          )}
          {phrase.isEmergency && (
            <span className="px-2.5 py-0.5 bg-accent/20 text-alert rounded-xl text-xs font-bold tracking-wide border border-accent/50">
              🚨 긴급 회화
            </span>
          )}
        </div>

        {/* Action icons: Bookmark & Billboard Fullscreen */}
        <div className="flex items-center gap-1.5">
          {/* Full-screen billboard mode launcher */}
          <button
            onClick={() => onOpenBillboard(phrase)}
            className="p-2 text-ink-mute hover:text-brand hover:bg-orange-50 rounded-xl transition-colors"
            title="3초 긴급 현장 전광판 확대"
          >
            <Maximize2 className="w-4 h-4 text-alert" />
          </button>

          {/* Bookmark Star */}
          <button
            onClick={() => onToggleBookmark(phrase.id)}
            // 예전에는 #FFB800 아이콘이었는데 흰 배경 대비 1.73:1 로,
            // 그래픽 최소 기준(3:1)에도 한참 못 미쳤습니다.
            className={`p-2 rounded-xl transition-colors ${
              isBookmarked
                ? 'text-alert bg-accent/30'
                : 'text-ink-mute hover:text-ink hover:bg-slate-100'
            }`}
            aria-pressed={isBookmarked}
            title={isBookmarked ? '저장 취소' : '저장하기'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* 본문 — 위계는 현장에서 쓰는 순서를 따릅니다.
          ① 원문(현지인에게 보여줌) ② 발음(내가 소리 내어 읽음) ③ 뜻 ④ 팁
          예전에는 넷이 전부 굵어서 무엇을 먼저 볼지 알 수 없었습니다. */}
      <div className="my-2.5 space-y-1.5">
        {/* ① 원문 — 유일한 font-black */}
        <h2 className="text-2xl sm:text-3xl font-black text-ink leading-tight font-display">
          {phrase.original}
        </h2>

        {/* ② 발음 — 한국인이 실제로 읽는 줄. 원문 다음으로 큽니다. */}
        <p className="inline-block bg-accent text-ink px-2.5 py-1 rounded-xl text-sm sm:text-base font-bold tracking-tight">
          {phrase.pronunciation}
        </p>

        {/* ③ 뜻 — 굵기를 낮춰 원문과 경쟁하지 않게 합니다. */}
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <p className="text-sm sm:text-base font-semibold text-ink-soft">{phrase.translation}</p>
          <span className="text-xs text-ink-mute font-medium">{country.language}</span>
        </div>
      </div>

      {/* 재생 중 표시 — 재생할 때만 나타납니다.
          예전에는 아무 정보도 없는 48px 다크 박스가 항상 자리를 차지했습니다. */}
      {isPlaying && (
        <div
          className="bg-ink h-10 rounded-xl mb-3 flex items-center justify-center gap-1.5 shadow-inner"
          role="status"
          aria-label="재생 중"
        >
          <span className="w-1.5 bg-brand-vivid h-5 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 bg-accent h-7 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 bg-white h-8 rounded-full animate-bounce" />
          <span className="w-1.5 bg-accent h-7 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 bg-brand-vivid h-5 rounded-full animate-bounce [animation-delay:-0.3s]" />
        </div>
      )}

      {/* ④ 팁 — 본문보다 한 단계 아래. 12px → 14px 로 키웠습니다. */}
      {phrase.usageTip && (
        <div className="bg-brand-tint p-3 rounded-xl mb-3 border-l-4 border-brand-vivid">
          <div className="flex items-center gap-1.5 text-brand font-bold mb-1 text-xs uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" />
            <span>현장 사용 팁</span>
          </div>
          <p className="text-xs leading-relaxed font-medium text-ink-soft">{phrase.usageTip}</p>
        </div>
      )}

      {/* Controls: Speed selector, Mic practice, Loud Speech Playback */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {/* 음성 출처 배지 — 사전 녹음인지 기기 TTS인지 솔직하게 표시합니다. */}
          {!isMutedByDesign && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl border shadow-xs ${
                hasAudio
                  ? 'text-pink-700 bg-pink-50 border-pink-200'
                  : 'text-slate-600 bg-slate-50 border-slate-200'
              }`}
              title={
                hasAudio
                  ? '앱에 내장된 녹음 파일 — 오프라인에서도 재생됩니다'
                  : '기기 내장 음성 합성 — 인터넷/기기에 따라 품질이 달라집니다'
              }
            >
              {hasAudio ? '👩 내장 음성' : '🤖 기기 음성'}
            </span>
          )}

          {/* Speed selector 0.8x / 1.0x / 1.2x */}
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
            {[0.8, 1.0, 1.2].map((s) => (
              <button
                key={s}
                onClick={() => onSetSpeed(s)}
                className={`px-2.5 py-1 rounded-xl font-extrabold transition-all ${
                  speed === s
                    ? 'bg-brand text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Mic STT Pronunciation Check button */}
          <button
            onClick={() => onOpenMicPractice(phrase)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-brand hover:bg-orange-50 transition-colors active:scale-95"
            title="내 발음 연습하기 (음성인식)"
          >
            <Mic className="w-4 h-4 text-brand" />
          </button>
        </div>

        {/* Loud Speech Playback Button */}
        {isMutedByDesign ? (
          <span
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-100 text-slate-500 font-bold text-xs border border-slate-200"
            title="공공장소에서 실수로 재생되는 것을 막기 위해 음성을 제공하지 않습니다"
          >
            <Info className="w-4 h-4" />
            <span>눈으로만 확인 (음성 없음)</span>
          </span>
        ) : (
          <button
            onClick={handleSpeak}
            aria-label={`${phrase.original} 큰 소리로 재생`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-brand hover:bg-brand-hover text-white font-bold text-xs sm:text-xs shadow-md shadow-brand-vivid/25 active:scale-95 transition-all duration-150"
          >
            <Volume2 className="w-4 h-4 fill-current" />
            <span>큰 소리로 재생</span>
          </button>
        )}
      </div>
    </div>
  );
};
