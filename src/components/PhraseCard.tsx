import React, { useState, useRef, useEffect } from 'react';
import { Phrase, Country } from '../types';
import { playPhrase, unlockAudioPlayback, hasRecordedAudio } from '../utils/speech';
import { copyText } from '../utils/clipboard';
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
  Copy,
  Check,
  Share2,
} from 'lucide-react';

export interface PhraseCardProps {
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
  const [copied, setCopied] = useState(false);

  const isMutedByDesign = phrase.toneGuide?.startsWith('🔴') ?? false;
  const hasAudio = hasRecordedAudio(phrase.id);

  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopy = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `${phrase.original} [${phrase.pronunciation}] - ${phrase.translation}`;
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: `GIJO Tour: ${phrase.original}`,
          text: `${phrase.original} [${phrase.pronunciation}]\n${phrase.translation}\n(${phrase.category})`,
        })
        .catch(() => {});
    }
  };

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
      className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
        isExpanded
          ? 'border-brand/40 shadow-sm'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* 1. 심플 리스트 헤더 (핵심 액션: 듣기 · 전광판 · 펼치기) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3.5 py-3 flex items-center justify-between gap-2.5 cursor-pointer select-none active:bg-slate-50"
      >
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          {index !== undefined && (
            <span className="text-xs font-bold text-ink-mute pt-0.5 tabular-nums shrink-0 w-4">
              {index + 1}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <h3 className="text-sm font-black text-ink tracking-tight">
                {phrase.original}
              </h3>
              <span className="text-[11px] text-brand font-bold">
                [{phrase.pronunciation}]
              </span>
            </div>
            <p className="text-xs text-ink-soft font-medium truncate mt-0.5">
              {phrase.translation}
            </p>
          </div>
        </div>

        {/* 우측 핵심 2액션 */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          {!isMutedByDesign && (
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-xl transition-colors active:scale-90 ${
                isPlaying
                  ? 'bg-amber-400 text-ink animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-ink'
              }`}
              title="원어민 발음 듣기"
              aria-label="원어민 발음 듣기"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onOpenBillboard(phrase)}
            className="p-2 text-ink-soft hover:text-ink hover:bg-slate-100 rounded-xl transition-colors"
            title="3초 긴급 현장 전광판 확대"
            aria-label="3초 긴급 현장 전광판 확대"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-ink"
            aria-label={isExpanded ? '접기' : '자세히 보기'}
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

      {/* 2. 상세 보기 */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-3 border-t border-slate-100 bg-slate-50/70 space-y-3 animate-in fade-in duration-150">
          {/* 상단 태그 & 보조 액션 (복사 · 발음연습 · 공유 · 저장 · 삭제) */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 bg-white border border-slate-200 text-ink-soft rounded-lg text-[11px] font-bold">
                {phrase.category}
              </span>
              {phrase.toneGuide && (
                <span className="text-[11px] text-ink-mute font-medium">
                  {phrase.toneGuide}
                </span>
              )}
              {phrase.isEmergency && (
                <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-lg text-[11px] font-bold border border-red-200">
                  긴급
                </span>
              )}
              {onDelete && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white text-ink-soft rounded-lg text-[11px] font-bold border border-slate-200">
                  <Sparkles className="w-3 h-3 text-brand" />
                  AI
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {!isMutedByDesign && (
                <button
                  onClick={() => onOpenMicPractice(phrase)}
                  aria-label="내 발음 연습하기 (음성인식)"
                  title="내 발음 연습하기 (음성인식)"
                  className="p-2 rounded-xl text-ink-soft hover:text-ink bg-white border border-slate-200 transition-colors"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleCopy}
                className={`p-2 rounded-xl transition-colors ${
                  copied
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'text-ink-soft hover:text-ink bg-white border border-slate-200'
                }`}
                title={copied ? '복사 완료!' : '문장 복사'}
                aria-label={copied ? '복사 완료' : '문장 복사'}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>

              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl text-ink-soft hover:text-ink bg-white border border-slate-200 transition-colors"
                  title="문장 공유하기"
                  aria-label="문장 공유하기"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => onToggleBookmark(phrase.id)}
                className={`p-2 rounded-xl transition-colors border ${
                  isBookmarked
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'text-ink-soft hover:text-ink bg-white border-slate-200'
                }`}
                aria-pressed={isBookmarked}
                aria-label={isBookmarked ? '저장 취소' : '저장하기'}
                title={isBookmarked ? '저장 취소' : '저장하기'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              {onDelete && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  aria-label="이 AI 문장 삭제"
                  title="이 AI 문장 삭제"
                  className="p-2 rounded-xl text-ink-soft hover:text-rose-600 bg-white border border-slate-200 transition-colors"
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

          {/* 원문 & 발음 & 뜻 & 팁 */}
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-ink leading-tight font-display tracking-tight">
              {phrase.original}
            </h2>

            <p className="inline-block bg-white border border-slate-200 text-brand px-2.5 py-0.5 rounded-lg text-sm font-black tracking-tight">
              [{phrase.pronunciation}]
            </p>

            <div className="flex items-baseline justify-between gap-3 flex-wrap pt-0.5">
              <p className="text-sm font-bold text-ink">{phrase.translation}</p>
              <span className="text-[11px] text-ink-mute font-medium">{country.language}</span>
            </div>

            {phrase.usageTip && (
              <div className="mt-2 bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-start gap-2 text-xs text-ink-soft">
                <Info className="w-4 h-4 text-ink-mute shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{phrase.usageTip}</span>
              </div>
            )}
          </div>

          {/* 하단 재생 컨트롤 바 */}
          <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              {isMutedByDesign ? (
                <div className="flex-1 py-2 px-3 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold text-center">
                  ⚠️ 안전을 위해 음성 재생을 제공하지 않습니다
                </div>
              ) : (
                <button
                  onClick={handleSpeak}
                  disabled={isPlaying}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                    isPlaying
                      ? 'bg-amber-400 text-ink'
                      : 'bg-slate-900 hover:bg-black text-white'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlaying ? '재생 중...' : '원어민 발음 듣기'}</span>
                </button>
              )}
            </div>

            {!isMutedByDesign && (
              <div className="flex items-center bg-white border border-slate-200 p-0.5 rounded-xl text-xs font-bold shrink-0">
                {[0.8, 1.0, 1.2].map((s) => (
                  <button
                    key={s}
                    onClick={() => onSetSpeed(s)}
                    className={`px-2 py-1 rounded-lg transition-colors ${
                      speed === s
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:text-ink'
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
