import React from 'react';
import { CategoryId } from '../types';
import { Layers, Plane, Hotel, Bus, Utensils, Tag, Heart, MessageCircleWarning, AlertTriangle } from 'lucide-react';

interface CategoryChipsProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  categoryCounts?: Record<CategoryId, number>;
}

const CATEGORIES: { id: CategoryId; icon: React.ReactNode }[] = [
  { id: '전체', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: '항공', icon: <Plane className="w-3.5 h-3.5" /> },
  { id: '호텔', icon: <Hotel className="w-3.5 h-3.5" /> },
  { id: '교통', icon: <Bus className="w-3.5 h-3.5" /> },
  { id: '식당', icon: <Utensils className="w-3.5 h-3.5" /> },
  { id: '흥정', icon: <Tag className="w-3.5 h-3.5" /> },
  { id: '미팅/사교', icon: <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" /> },
  { id: '욕설/은어', icon: <MessageCircleWarning className="w-3.5 h-3.5" /> },
  { id: '비상', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
      {CATEGORIES.map((c) => {
        const active = selectedCategory === c.id;
        const isEmergencyCat = c.id === '비상';
        const count = categoryCounts ? categoryCounts[c.id] : undefined;

        return (
          <button
            key={c.id}
            onClick={() => onSelectCategory(c.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 shadow-xs ${
              active
                ? 'bg-brand text-white shadow-md shadow-brand-vivid/30 scale-[1.02]'
                : isEmergencyCat
                ? 'bg-accent/20 text-alert border-2 border-accent/60 hover:bg-accent/30'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-orange-50/60'
            }`}
          >
            {c.icon}
            <span>{c.id}</span>
            {count !== undefined && (
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500'
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
