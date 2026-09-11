import React, { useMemo, useState } from 'react';
import { BookOpen, Star, Volume2 } from 'lucide-react';
import type { Country, CountryId, VocabUnitId } from '../../types';
import { VOCAB_UNITS } from '../../data/vocab';
import {
  isVocabWord,
  vocabDisplay,
  vocabItemById,
  vocabSourceCountry,
  type VocabItem,
  type VocabProgressMap,
} from '../../utils/vocab';
import { useVocabAudio } from '../../hooks/useVocabAudio';
import { QuizMode } from './QuizMode';

interface VocabBookshelfProps {
  country: Country;
  speed: number;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  progress: VocabProgressMap;
  onAnswer: (id: string, correct: boolean) => void;
}

type SortMode = 'recent' | 'unit';

/**
 * 보관함 위쪽 "내 단어장".
 *
 * 아래의 기존 문장 보관함과는 저장 키가 다릅니다(`gijo_vocab_saved_v1` ↔
 * `quickpass_bookmarks_v1`). 섞지 않은 이유는 성격이 달라서입니다 —
 * 문장 북마크는 "현장에서 보여줄 것", 단어장은 "외울 것" 입니다.
 */
export const VocabBookshelf: React.FC<VocabBookshelfProps> = ({
  country,
  speed,
  savedIds,
  onToggleSave,
  progress,
  onAnswer,
}) => {
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [quizOpen, setQuizOpen] = useState(false);
  const { playingId, play } = useVocabAudio(country, speed);

  const items = useMemo(
    () =>
      savedIds
        .map(vocabItemById)
        .filter((item): item is VocabItem => Boolean(item)),
    [savedIds]
  );

  /** 최근순 = 나중에 담은 것이 위로. 저장 배열은 담은 순서대로 쌓입니다. */
  const recent = useMemo(() => [...items].reverse(), [items]);

  const byUnit = useMemo(() => {
    const groups = new Map<VocabUnitId, VocabItem[]>();
    for (const item of items) {
      const list = groups.get(item.unitId) ?? [];
      list.push(item);
      groups.set(item.unitId, list);
    }
    // 단원 순서는 여행 흐름 순(VOCAB_UNITS)을 따릅니다.
    return VOCAB_UNITS.filter((unit) => groups.has(unit.id)).map((unit) => ({
      unit,
      items: groups.get(unit.id) as VocabItem[],
    }));
  }, [items]);

  /** 나라가 다른 항목(저장해 둔 베트남어 등)은 자기 나라 기준으로 보여줍니다. */
  const viewCountryFor = (item: VocabItem): CountryId =>
    item.countryId === vocabSourceCountry(country.id) ? country.id : item.countryId;

  const renderRow = (item: VocabItem) => {
    const display = vocabDisplay(item, viewCountryFor(item));
    const emoji = isVocabWord(item) ? item.emoji : '💬';
    const playing = playingId === item.id;

    return (
      <li
        key={item.id}
        className="bg-white border-2 border-slate-100 rounded-2xl p-3 shadow-xs flex items-center gap-3"
      >
        <span className="text-3xl leading-none shrink-0" aria-hidden="true">
          {emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-900 truncate">{item.meaning}</p>
          <p className="text-xs font-extrabold text-brand truncate">
            {display.pronunciation}
          </p>
          <p className="text-xs font-bold text-ink-mute truncate">{display.text}</p>
        </div>

        <button
          type="button"
          onClick={() => play(item)}
          aria-label="소리 듣기"
          className={`w-11 h-11 shrink-0 flex items-center justify-center rounded-xl active:scale-95 ${
            playing ? 'bg-amber-400 text-ink animate-pulse' : 'bg-brand-tint text-brand'
          }`}
        >
          <Volume2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onToggleSave(item.id)}
          aria-label="저장 목록에서 빼기"
          className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border-2 border-accent bg-accent text-ink active:scale-95"
        >
          <Star className="w-4 h-4 fill-current" />
        </button>
      </li>
    );
  };

  return (
    <section className="space-y-3" aria-label="내 단어장">
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand" />
              <span>내 단어장 ({items.length})</span>
            </h2>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              배우기에서 ★ 로 담은 단어와 말이에요.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setQuizOpen(true)}
            className="min-h-11 px-4 shrink-0 rounded-xl bg-brand text-white text-xs font-black shadow-xs active:scale-95"
          >
            복습하기
          </button>
        </div>

        {items.length > 0 && (
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold w-fit">
            {(
              [
                ['recent', '최근순'],
                ['unit', '단원순'],
              ] as Array<[SortMode, string]>
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSortMode(mode)}
                aria-pressed={sortMode === mode}
                className={`min-h-11 px-4 rounded-lg transition-colors ${
                  sortMode === mode
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {quizOpen && (
        <QuizMode
          country={country}
          speed={speed}
          savedIds={savedIds}
          progress={progress}
          onAnswer={onAnswer}
          onClose={() => setQuizOpen(false)}
        />
      )}

      {items.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-2xl border-2 border-slate-100 px-6 shadow-xs">
          <p className="text-xs font-bold text-slate-700">아직 담은 단어가 없어요.</p>
          <p className="text-xs text-ink-mute mt-1 font-bold">
            배우기 탭에서 ★ 를 누르면 여기에 모여요.
          </p>
        </div>
      ) : sortMode === 'recent' ? (
        <ul className="space-y-2">{recent.map(renderRow)}</ul>
      ) : (
        <div className="space-y-3">
          {byUnit.map(({ unit, items: unitItemList }) => (
            <div key={unit.id} className="space-y-2">
              <h3 className="text-xs font-black text-ink-soft px-1">
                {unit.emoji} {unit.title} ({unitItemList.length})
              </h3>
              <ul className="space-y-2">{unitItemList.map(renderRow)}</ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
