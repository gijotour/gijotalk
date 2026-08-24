import React, { useState } from 'react';
import { Phrase, Country } from '../types';
import { playPhrase, unlockAudioPlayback, hasRecordedAudio } from '../utils/speech';
import { track } from '../utils/analytics';
import {
  Volume2,
  Mic,
  Maximize2,
  Bookmark,
  Info,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PhraseCardProps {
  phrase: Phrase;
  country: Country;
  speed: number;
  onSetSpeed: (speed: number) => void;
  isBookmarked: boolean;
  onToggleBookmark: (phraseId: string) => void;
  onOpenBillboard: (phrase: Phrase) => void;
  onOpenMicPractice: (phrase: Phrase) => void;
  /** AI 가 만든 문장일 때만 넘어옵니다. 기본 문장은 지울 수 없습니다. */
  onDelete?: (phraseId: string) => void;
  /** 리스트 순번 뱃지 (1, 2, 3...) */
  index?: number;
  /** 기본 펼침 여부 */
  defaultExpanded?: boolean;
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
  onDelete,
  index,
  defaultExpanded = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const isMutedByDesign = phrase.toneGuide?.startsWith('🔴') ?? false;
  const hasAudio = hasRecordedAudio(phrase.id);

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
    <div
      className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-xs ${
        isExpanded
          ? 'bg-white border-brand-vivid shadow-md ring-2 ring-brand-vivid/20'
          : 'bg-white border-slate-200/90 hover:border-brand-vivid/50'
      }`}
    >
      {/* 1. 컴팩트 리스트 헤더 (터치 시 카드 형태로 펼쳐짐 + 빠른 액션 바) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3.5 flex items-center justify-between gap-2.5 cursor-pointer select-none active:bg-slate-50"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {index !== undefined && (
            <span
              className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 shadow-xs ${
                isExpanded ? 'bg-brand text-white' : 'bg-slate-900 text-white'
              }`}
            >
              {index + 1}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                {phrase.original}
              </h3>
              <span className="text-[11px] text-rose-600 font-extrabold">
                [{phrase.pronunciation}]
              </span>
            </div>
            <p className="text-xs text-slate-600 font-bold truncate mt-0.5">
              {phrase.translation}
            </p>
          </div>
        </div>

        {/* 오른쪽 빠른 원터치 액션 버튼들 */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* 전광판 */}
          <button
            onClick={() => onOpenBillboard(phrase)}
            className="p-2 text-ink-mute hover:text-brand hover:bg-orange-50 rounded-xl transition-colors"
            title="3초 긴급 현장 전광판 확대"
            aria-label="3초 긴급 현장 전광판 확대"
          >
            <Maximize2 className="w-4 h-4 text-alert" />
          </button>

          {/* 발음 연습 마이크 */}
          {!isMutedByDesign && (
            <button
              onClick={() => onOpenMicPractice(phrase)}
              aria-label="내 발음 연습하기 (음성인식)"
              title="내 발음 연습하기 (음성인식)"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}

          {/* 빠른 원터치 발음 듣기 */}
          {!isMutedByDesign && (
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-xl transition-all active:scale-90 ${
                isPlaying
                  ? 'bg-amber-400 text-slate-900 animate-pulse'
                  : 'bg-orange-50 hover:bg-orange-100 text-brand'
              }`}
              title="원어민 발음 듣기"
            >
              <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
            </button>
          )}

          {/* 펼치기 / 접기 화살표 */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-700"
            title={isExpanded ? '접기' : '자세히 보기'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-brand" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* 2. 탭하면 카드 형태로 자세히 나오는 영역 (Expandable Detailed Card) */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-orange-50/20 space-y-3 animate-in fade-in zoom-in-98 duration-150">
          {/* 상단 태그 & 북마크 */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-orange-100 text-brand rounded-xl text-xs font-bold uppercase tracking-wider">
                {phrase.category}
              </span>
              {phrase.toneGuide && (
                <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-xl font-bold">
                  {phrase.toneGuide}
                </span>
              )}
              {phrase.isEmergency && (
                <span className="px-2.5 py-0.5 bg-accent/20 text-alert rounded-xl text-xs font-bold tracking-wide border border-accent/50">
                  🚨 긴급 회화
                </span>
              )}
              {onDelete && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-700 rounded-xl text-xs font-bold border border-violet-200">
                  <Sparkles className="w-3 h-3" />
                  AI 생성
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* 북마크 */}
              <button
                onClick={() => onToggleBookmark(phrase.id)}
                className={`p-2 rounded-xl transition-colors ${
                  isBookmarked
                    ? 'text-alert bg-accent/30'
                    : 'text-ink-mute hover:text-ink bg-white border border-slate-200'
                }`}
                aria-pressed={isBookmarked}
                title={isBookmarked ? '저장 취소' : '저장하기'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              {onDelete && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  aria-label="이 AI 문장 삭제"
                  title="이 AI 문장 삭제"
                  className="p-2 rounded-xl text-ink-mute hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 삭제 확인 */}
          {confirmDelete && onDelete && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-rose-800 min-w-0">
                이 문장을 삭제할까요? 되돌릴 수 없습니다.
              </p>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 text-ink-soft text-xs font-bold rounded-xl"
                >
                  취소
                </button>
                <button
                  onClick={() => onDelete(phrase.id)}
                  className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
                >
                  삭제
                </button>
              </div>
            </div>
          )}

          {/* 대형 카드 본문: 원문 & 발음 & 뜻 & 팁 */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight font-display tracking-tight">
              {phrase.original}
            </h2>

            <p className="inline-block bg-accent text-ink px-3 py-1 rounded-xl text-sm sm:text-base font-black tracking-tight">
              [{phrase.pronunciation}]
            </p>

            <div className="flex items-baseline justify-between gap-3 flex-wrap pt-0.5">
              <p className="text-base font-extrabold text-slate-800">{phrase.translation}</p>
              <span className="text-xs text-ink-mute font-bold">{country.language}</span>
            </div>

            {phrase.usageTip && (
              <div className="mt-2 bg-white border border-orange-200/80 rounded-xl p-2.5 flex items-start gap-2 text-xs text-slate-700">
                <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{phrase.usageTip}</span>
              </div>
            )}
          </div>

          {/* 하단 재생 컨트롤 바 */}
          <div className="pt-3 border-t border-orange-200/60 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              {isMutedByDesign ? (
                <div className="flex-1 py-2 px-3 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold text-center">
                  ⚠️ 안전을 위해 음성 재생을 제공하지 않습니다
                </div>
              ) : (
                <button
                  onClick={handleSpeak}
                  disabled={isPlaying}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-xs ${
                    isPlaying
                      ? 'bg-amber-400 text-slate-900 animate-pulse'
                      : 'bg-brand hover:bg-brand-hover text-white'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                  <span>{isPlaying ? '재생 중...' : '원어민 발음 듣기'}</span>
                </button>
              )}
            </div>

            {/* 배속 조절 */}
            {!isMutedByDesign && (
              <div className="flex items-center bg-white border border-slate-200 p-0.5 rounded-xl text-xs font-bold shrink-0">
                {[0.8, 1.0, 1.2].map((s) => (
                  <button
                    key={s}
                    onClick={() => onSetSpeed(s)}
                    className={`px-2 py-1 rounded-lg transition-colors ${
                      speed === s
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
