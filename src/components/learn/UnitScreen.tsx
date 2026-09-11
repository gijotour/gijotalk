import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import type { Country, Phrase, VocabUnit } from '../../types';
import {
  dialogsFor,
  expressionsFor,
  unitProgress,
  unitStampId,
  wordsFor,
  type VocabProgressMap,
} from '../../utils/vocab';
import { useVocabAudio } from '../../hooks/useVocabAudio';
import { WordCard } from './WordCard';
import { ExpressionList } from './ExpressionList';
import { DialogView } from './DialogView';

type Stage = 'words' | 'expressions' | 'dialog';

const STAGE_LABEL: Record<Stage, string> = {
  words: '단어',
  expressions: '짧은 말',
  dialog: '대화',
};

interface UnitScreenProps {
  unit: VocabUnit;
  country: Country;
  speed: number;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  progress: VocabProgressMap;
  onMarkSeen: (id: string) => void;
  unitDone: string[];
  onUnitDone: (stamp: string) => void;
  onOpenBillboard: (phrase: Phrase) => void;
  onBack: () => void;
}

/**
 * 단원 화면 — 단어 → 짧은 말 → 대화.
 *
 * 3단계를 다 "들러야" 도장이 찍힙니다. 정답률이 아니라 통과 여부입니다 —
 * 초등 교과서의 단원 마무리 스티커와 같은 성격이고, 평가는 복습 퀴즈가 합니다.
 */
export const UnitScreen: React.FC<UnitScreenProps> = ({
  unit,
  country,
  speed,
  savedIds,
  onToggleSave,
  progress,
  onMarkSeen,
  unitDone,
  onUnitDone,
  onOpenBillboard,
  onBack,
}) => {
  const words = useMemo(() => wordsFor(country.id, unit.id), [country.id, unit.id]);
  const expressions = useMemo(
    () => expressionsFor(country.id, unit.id),
    [country.id, unit.id]
  );
  const dialog = useMemo(() => dialogsFor(country.id, unit.id)[0], [country.id, unit.id]);

  // 내용이 없는 단계는 아예 세지 않습니다 — 빈 화면을 봐야 도장이 찍히면 이상합니다.
  const stages = useMemo(() => {
    const list: Stage[] = [];
    if (words.length > 0) list.push('words');
    if (expressions.length > 0) list.push('expressions');
    if (dialog) list.push('dialog');
    return list.length > 0 ? list : (['words'] as Stage[]);
  }, [words.length, expressions.length, dialog]);

  const [stage, setStage] = useState<Stage>(stages[0]);
  const [visited, setVisited] = useState<Stage[]>([stages[0]]);

  useEffect(() => {
    setStage(stages[0]);
    setVisited([stages[0]]);
  }, [stages]);

  const { playingId, play, stop } = useVocabAudio(country, speed);

  const { seen, total } = unitProgress(country.id, unit.id, progress);
  const stamp = unitStampId(country.id, unit.id);
  const stamped = unitDone.includes(stamp);
  const allVisited = stages.every((s) => visited.includes(s));

  useEffect(() => {
    if (allVisited && !stamped) onUnitDone(stamp);
  }, [allVisited, stamped, stamp, onUnitDone]);

  const openStage = (next: Stage) => {
    stop();
    setStage(next);
    setVisited((prev) => (prev.includes(next) ? prev : [...prev, next]));
  };

  return (
    <section className="space-y-3" aria-label={`${unit.title} 단원`}>
      {/* 단원 머리 */}
      <div className="bg-white border-2 border-slate-100 rounded-2xl p-3 shadow-xs flex items-center gap-2.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="단원 목록으로 돌아가기"
          className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border-2 border-slate-200 text-ink-soft active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-3xl leading-none" aria-hidden="true">
          {unit.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-black text-slate-900">{unit.title}</h2>
          <p className="text-xs font-bold text-ink-mute truncate">{unit.description}</p>
        </div>
      </div>

      {/* 3단계 탭 */}
      <div className="grid grid-cols-3 gap-2">
        {(['words', 'expressions', 'dialog'] as Stage[]).map((s) => {
          const active = stage === s;
          const done = visited.includes(s);
          const available = stages.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => openStage(s)}
              disabled={!available}
              aria-label={`${STAGE_LABEL[s]} 단계`}
              aria-pressed={active}
              className={`min-h-12 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-40 ${
                active
                  ? 'bg-brand border-brand text-white'
                  : 'bg-white border-slate-200 text-ink-soft'
              }`}
            >
              <span>{STAGE_LABEL[s]}</span>
              {done && available && (
                <Check className={`w-4 h-4 ${active ? 'text-white' : 'text-emerald-600'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* 단계 본문 */}
      {stage === 'words' && (
        <WordCard
          words={words}
          country={country}
          savedIds={savedIds}
          onToggleSave={onToggleSave}
          onMarkSeen={onMarkSeen}
          playingId={playingId}
          onPlay={play}
        />
      )}

      {stage === 'expressions' && (
        <ExpressionList
          expressions={expressions}
          country={country}
          savedIds={savedIds}
          onToggleSave={onToggleSave}
          onMarkSeen={onMarkSeen}
          playingId={playingId}
          onPlay={play}
          onOpenBillboard={onOpenBillboard}
        />
      )}

      {stage === 'dialog' && (
        <DialogView
          dialog={dialog}
          country={country}
          savedIds={savedIds}
          onToggleSave={onToggleSave}
          onMarkSeen={onMarkSeen}
          playingId={playingId}
          onPlay={play}
          onStop={stop}
        />
      )}

      {/* 단원 마무리 도장 */}
      {allVisited && (
        <div className="bg-accent-tint border-2 border-accent rounded-2xl p-4 text-center space-y-2 animate-in fade-in duration-200">
          <p className="text-lg font-black text-slate-900">다 배웠어요 🎉</p>
          <p className="text-xs font-bold text-slate-700">
            {unit.title} 단원에 도장을 찍었어요. 보관함에서 복습해 볼까요?
          </p>
          <button
            type="button"
            onClick={onBack}
            className="min-h-12 w-full rounded-2xl bg-brand text-white text-sm font-black shadow-xs active:scale-95"
          >
            단원 목록으로
          </button>
        </div>
      )}

      {/* 진행률 안내 — 맞은 개수가 아니라 "본 것" 기준입니다 */}
      <p className="text-center text-xs font-bold text-ink-mute">
        {stages.length}단계 중 {visited.length}단계 · 본 것 {seen} / {total}
      </p>
    </section>
  );
};
