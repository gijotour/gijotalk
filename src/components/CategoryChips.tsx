import React from 'react';
import { CategoryId } from '../types';
import { Bookmark, Star } from 'lucide-react';

export type PhraseFilterCategory = CategoryId | '저장';

interface CategoryChipsProps {
  selectedCategory: PhraseFilterCategory;
  onSelectCategory: (cat: PhraseFilterCategory) => void;
  categoryCounts?: Record<CategoryId, number>;
  savedCount?: number;
}

const CATEGORIES: PhraseFilterCategory[] = [
  '10대 기본',
  '전체',
  '저장',
  '교통',
  '식당',
  '음식',
  '호텔',
  '흥정',
  '관광',
  '마사지',
  '골프',
  '항공',
  '미팅/사교',
  '욕설/은어',
  '비상',
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  savedCount = 0,
}) => {
  return (
    <div
      className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1"
      role="tablist"
      aria-label="상황별 회화 카테고리"
    >
      {CATEGORIES.map((id) => {
        const active = selectedCategory === id;
        const count =
          id === '저장'
            ? savedCount
            : categoryCounts && id !== '10대 기본'
            ? categoryCounts[id]
            : undefined;

        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelectCategory(id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors active:scale-95 shrink-0 border ${
              active
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {id === '10대 기본' && <Star className="w-3 h-3 fill-current opacity-80" />}
            {id === '저장' && <Bookmark className="w-3 h-3 fill-current opacity-80" />}
            <span>{id}</span>
            {count !== undefined && (id === '저장' ? count > 0 : id !== '전체') && (
              <span
                className={`text-[11px] font-semibold ${
                  active ? 'text-white/75' : 'text-ink-mute'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
