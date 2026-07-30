import React, { useState } from 'react';
import { Phrase, Country } from '../types';
import { speakPhrase } from '../utils/audio';
import { Volume2, Mic, Maximize2, Bookmark, Info, Check, Sparkles } from 'lucide-react';

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

  const handleSpeak = () => {
    setIsPlaying(true);
    speakPhrase({
      text: phrase.original,
      langCode: country.langCode,
      rate: speed,
      volume: 1.0,
      voiceGender: 'female',
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-100 hover:border-[#FF6B4A] shadow-xs relative overflow-hidden group transition-all duration-200">
      {/* Top Meta Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-orange-100 text-[#FF6B4A] rounded-md text-[11px] font-black uppercase tracking-wider">
            {phrase.category}
          </span>
          {phrase.toneGuide && (
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-bold">
              {phrase.toneGuide}
            </span>
          )}
          {phrase.isEmergency && (
            <span className="px-2.5 py-0.5 bg-[#FFB800]/20 text-[#D97706] rounded-md text-[10px] font-black tracking-wide border border-[#FFB800]/50">
              🚨 긴급 회화
            </span>
          )}
        </div>

        {/* Action icons: Bookmark & Billboard Fullscreen */}
        <div className="flex items-center gap-1.5">
          {/* Full-screen billboard mode launcher */}
          <button
            onClick={() => onOpenBillboard(phrase)}
            className="p-2 text-slate-400 hover:text-[#FF6B4A] hover:bg-orange-50 rounded-lg transition-colors"
            title="3초 긴급 현장 전광판 확대"
          >
            <Maximize2 className="w-4 h-4 text-[#D97706]" />
          </button>

          {/* Bookmark Star */}
          <button
            onClick={() => onToggleBookmark(phrase.id)}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked ? 'text-[#FFB800] bg-[#FFB800]/15' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isBookmarked ? '저장 취소' : '저장하기'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Main Phrase & Translation */}
      <div className="my-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight italic font-['Montserrat']">
            {phrase.original}
          </h2>
        </div>

        {/* Korean Pronunciation Guide Bracketed & Translation */}
        <div className="flex items-center gap-3 flex-wrap mt-2">
          <span className="bg-[#FFB800] text-slate-900 px-3 py-1 rounded-md text-sm sm:text-base font-black shadow-xs">
            {phrase.pronunciation}
          </span>
          <span className="text-lg sm:text-xl font-bold text-slate-700">
            {phrase.translation}
          </span>
          <span className="text-xs text-slate-400 font-bold ml-auto">{country.language}</span>
        </div>
      </div>

      {/* Wave Sound Visualization Box (Dark HUD Style) */}
      <div className="bg-slate-900 h-12 rounded-xl my-4 flex items-center justify-center px-4 relative overflow-hidden border border-slate-800 shadow-inner">
        {isPlaying ? (
          <div className="flex items-center justify-center gap-1.5 w-full h-full">
            <span className="w-1.5 bg-[#FF6B4A] h-6 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 bg-[#FFB800] h-8 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 bg-white h-10 rounded-full animate-bounce"></span>
            <span className="w-1.5 bg-[#FFB800] h-8 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 bg-[#FF6B4A] h-6 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          </div>
        ) : (
          <svg className="w-full h-6 opacity-60" viewBox="0 0 400 40">
            <path
              d="M0,20 Q50,5 100,20 T200,20 T300,20 T400,20"
              fill="none"
              stroke="#FF6B4A"
              strokeWidth="2.5"
            />
          </svg>
        )}
      </div>

      {/* Usage Tip Banner */}
      {phrase.usageTip && (
        <div className="bg-orange-50/60 p-3.5 rounded-xl mb-4 border-l-4 border-[#FF6B4A] text-xs text-slate-700">
          <div className="flex items-center gap-1.5 text-[#FF6B4A] font-extrabold mb-1">
            <Info className="w-3.5 h-3.5" />
            <span>현장 사용 팁</span>
          </div>
          <p className="leading-relaxed font-medium">{phrase.usageTip}</p>
        </div>
      )}

      {/* Controls: Speed selector, Mic practice, Loud Speech Playback */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {/* Female Voice Indicator Badge */}
          <span
            className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-xl border border-pink-200 shadow-2xs"
            title="여성 현지식 억양 오디오 발음 적용됨"
          >
            👩 현지 여성 음성
          </span>

          {/* Speed selector 0.8x / 1.0x / 1.2x */}
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
            {[0.8, 1.0, 1.2].map((s) => (
              <button
                key={s}
                onClick={() => onSetSpeed(s)}
                className={`px-2.5 py-1 rounded-lg font-extrabold transition-all ${
                  speed === s
                    ? 'bg-[#FF6B4A] text-white shadow-xs'
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
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#FF6B4A] hover:bg-orange-50 transition-colors active:scale-95"
            title="내 발음 연습하기 (음성인식)"
          >
            <Mic className="w-4 h-4 text-[#FF6B4A]" />
          </button>
        </div>

        {/* Loud Speech Playback Button */}
        <button
          onClick={handleSpeak}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF6B4A] hover:bg-[#ff5a36] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#FF6B4A]/25 active:scale-95 transition-all duration-150"
        >
          <Volume2 className="w-4 h-4 fill-current" />
          <span>큰 소리로 재생</span>
        </button>
      </div>
    </div>
  );
};
