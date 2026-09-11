import React from 'react';
import type { Country, VocabUnitId } from '../../types';
import { VOCAB_UNITS } from '../../data/vocab';
import { unitProgress, unitStampId, type VocabProgressMap } from '../../utils/vocab';

interface UnitListProps {
  country: Country;
  progress: VocabProgressMap;
  unitDone: string[];
  onOpenUnit: (unitId: VocabUnitId) => void;
}

/**
 * 배우기 첫 화면 — 단원 10개.
 *
 * 초등 교과서의 목차입니다. 한 줄에 하나씩, 이모지를 크게 둡니다.
 * 진행률 바와 도장이 "어디까지 했는지" 를 글자 없이 알려줍니다.
 */
export const UnitList: React.FC<UnitListProps> = ({
  country,
  progress,
  unitDone,
  onOpenUnit,
}) => {
  const doneCount = VOCAB_UNITS.filter((u) =>
    unitDone.includes(unitStampId(country.id, u.id))
  ).length;

  return (
    <section className="space-y-3" aria-label="단원 목록">
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs">
        <h2 className="text-sm font-extrabold text-slate-900">
          {country.flag} {country.language} 배우기
        </h2>
        <p className="text-xs text-slate-500 font-bold mt-0.5">
          한 단원에 단어 조금, 짧은 말 조금. 오늘은 어디부터 해볼까요?
        </p>
        <div className="mt-2 text-xs font-extrabold text-brand">
          도장 {doneCount} / {VOCAB_UNITS.length}
        </div>
      </div>

      <ul className="space-y-2.5">
        {VOCAB_UNITS.map((unit) => {
          const { seen, total } = unitProgress(country.id, unit.id, progress);
          const percent = total > 0 ? Math.round((seen / total) * 100) : 0;
          const stamped = unitDone.includes(unitStampId(country.id, unit.id));

          return (
            <li key={unit.id}>
              <button
                onClick={() => onOpenUnit(unit.id)}
                aria-label={`${unit.title} 단원 열기`}
                className="w-full min-h-[76px] text-left bg-white hover:border-brand-vivid border-2 border-slate-100 rounded-2xl p-3.5 shadow-xs active:scale-[0.99] transition-all flex items-center gap-3.5"
              >
                <span className="text-4xl shrink-0 leading-none" aria-hidden="true">
                  {unit.emoji}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{unit.title}</span>
                    {stamped && (
                      <span className="px-2 py-0.5 bg-accent text-ink rounded-xl text-xs font-black">
                        다 배웠어요 🎉
                      </span>
                    )}
                  </span>
                  <span className="block text-xs text-slate-500 font-bold mt-0.5 truncate">
                    {unit.description}
                  </span>

                  <span className="flex items-center gap-2 mt-2">
                    <span className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <span
                        className="block h-full bg-brand-vivid rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </span>
                    <span className="text-xs font-extrabold text-ink-soft shrink-0">
                      {seen} / {total}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
