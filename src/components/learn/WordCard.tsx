import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Volume2, Info } from 'lucide-react';
import type { Country, VocabWord } from '../../types';
import { vocabDisplay, type VocabItem } from '../../utils/vocab';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface WordCardProps {
  words: VocabWord[];
  country: Country;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onMarkSeen: (id: string) => void;
  playingId: string | null;
  onPlay: (item: VocabItem) => void;
}

/** 손가락으로 넘겼다고 볼 최소 거리. 이보다 작으면 그냥 탭입니다. */
const SWIPE_PX = 45;

/**
 * 단어 단계 — 한 화면에 한 장.
 *
 * 앞면은 글자를 거의 두지 않습니다. 이모지와 한글 발음만 크게 보여주고,
 * 뜻은 탭해서 뒤집어야 나옵니다. 뜻이 같이 보이면 아이도 어른도 발음을 읽지 않고
 * 뜻만 읽습니다 — 그러면 카드가 아니라 목록입니다.
 *
 * 뒤집기를 3D 로 하지 않은 이유: 앞뒤 면을 동시에 DOM 에 두면 화면 낭독기가
 * 안 보이는 면까지 읽습니다. 여기서는 한 면만 그리고 나타나는 동작만 줍니다.
 */
export const WordCard: React.FC<WordCardProps> = ({
  words,
  country,
  savedIds,
  onToggleSave,
  onMarkSeen,
  playingId,
  onPlay,
}) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const total = words.length;
  const word = words[Math.min(index, Math.max(total - 1, 0))];

  const go = (delta: number) => {
    if (total === 0) return;
    setIndex((prev) => {
      const next = prev + delta;
      if (next < 0 || next >= total) return prev;
      return next;
    });
    setFlipped(false);
    setShowTip(false);
  };

  // 단원이나 나라가 바뀌어 목록이 통째로 갈리면 첫 장 앞면부터 다시 봅니다.
  useEffect(() => {
    setIndex(0);
    setFlipped(false);
    setShowTip(false);
  }, [words]);

  // 키보드로도 넘길 수 있어야 합니다 (태블릿 + 블루투스 키보드, 데스크톱 검수).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  if (!word) {
    return (
      <p className="text-center text-xs font-bold text-ink-mute py-12">
        이 단원의 단어는 아직 준비 중이에요.
      </p>
    );
  }

  const display = vocabDisplay(word, country.id);
  const saved = savedIds.includes(word.id);
  const playing = playingId === word.id;

  const handleFlip = () => {
    setFlipped((prev) => {
      if (!prev) onMarkSeen(word.id);
      return !prev;
    });
  };

  const handlePlay = () => {
    onMarkSeen(word.id);
    onPlay(word);
  };

  const animation = reduceMotion ? '' : 'animate-in fade-in zoom-in-95 duration-200';

  return (
    <div className="space-y-3">
      {/* 카드 본체 — 어디를 눌러도 뒤집힙니다 */}
      <button
        type="button"
        onClick={handleFlip}
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          if (start === null) return;
          const delta = (e.changedTouches[0]?.clientX ?? start) - start;
          if (Math.abs(delta) < SWIPE_PX) return;
          // 왼쪽으로 밀면 다음 장 — 책장 넘기는 방향과 같습니다.
          go(delta < 0 ? 1 : -1);
        }}
        aria-label="단어 카드 뒤집기"
        aria-pressed={flipped}
        className="w-full min-h-[290px] bg-white border-2 border-slate-100 rounded-2xl shadow-xs px-5 py-7 flex flex-col items-center justify-center gap-3 text-center active:scale-[0.99] transition-transform"
      >
        {!flipped ? (
          <div className={`flex flex-col items-center gap-3 ${animation}`}>
            <span className="text-7xl leading-none" aria-hidden="true">
              {word.emoji}
            </span>
            <span className="inline-block bg-accent text-ink px-4 py-1.5 rounded-2xl text-3xl font-black tracking-tight">
              {display.pronunciation}
            </span>
            <span className="text-base font-extrabold text-slate-700 font-display">
              {display.text}
            </span>
            {display.subText && (
              <span className="text-xs font-bold text-ink-mute">
                {display.subText} {display.subPronunciation}
              </span>
            )}
            <span className="text-xs font-bold text-brand mt-1">눌러서 뜻 보기 👆</span>
          </div>
        ) : (
          <div className={`flex flex-col items-center gap-3 ${animation}`}>
            <span className="text-5xl leading-none" aria-hidden="true">
              {word.emoji}
            </span>
            <span className="text-3xl font-black text-slate-900">{word.meaning}</span>
            <span className="text-sm font-extrabold text-brand">{display.pronunciation}</span>
            <span className="text-xs font-bold text-ink-mute">{display.text}</span>
          </div>
        )}
      </button>

      {/* 도움말 — 문법 설명은 접어둡니다 (초등 수준 원칙) */}
      {flipped && word.tip && (
        <div className="bg-white border-2 border-orange-100 rounded-2xl px-3 py-2">
          <button
            type="button"
            onClick={() => setShowTip((v) => !v)}
            aria-expanded={showTip}
            className="w-full min-h-11 flex items-center gap-2 text-xs font-extrabold text-brand"
          >
            <Info className="w-4 h-4 shrink-0" />
            <span>{showTip ? '도움말 접기' : '도움말 보기'}</span>
          </button>
          {showTip && (
            <p className="text-xs font-medium text-slate-700 leading-relaxed pb-1.5 px-1">
              {word.tip}
            </p>
          )}
        </div>
      )}

      {/* 재생 · 저장 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePlay}
          aria-label="소리 듣기"
          className={`flex-1 min-h-12 flex items-center justify-center gap-2 rounded-2xl font-black text-sm shadow-xs active:scale-95 transition-all ${
            playing ? 'bg-amber-400 text-ink animate-pulse' : 'bg-brand text-white'
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span>{playing ? '듣는 중…' : '소리 듣기'}</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleSave(word.id)}
          aria-label={saved ? '단어 저장 취소' : '단어 저장'}
          aria-pressed={saved}
          className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl border-2 active:scale-95 transition-all ${
            saved
              ? 'bg-accent border-accent text-ink'
              : 'bg-white border-slate-200 text-ink-mute'
          }`}
        >
          <Star className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* 이전 / 다음 + 진행 점 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="이전 단어"
          className="w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl border-2 border-slate-200 bg-white text-ink-soft disabled:opacity-35 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="flex items-center justify-center gap-1.5 flex-wrap" aria-hidden="true">
            {words.map((w, i) => (
              <span
                key={w.id}
                className={`w-2 h-2 rounded-full ${
                  i === index ? 'bg-brand' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-extrabold text-ink-soft">
            {index + 1} / {total}
          </span>
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          disabled={index >= total - 1}
          aria-label="다음 단어"
          className="w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl border-2 border-slate-200 bg-white text-ink-soft disabled:opacity-35 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <p className="text-center text-xs font-bold text-ink-mute">
        옆으로 밀어서 다음 장 · 한 번 더 들어볼까요?
      </p>
    </div>
  );
};
