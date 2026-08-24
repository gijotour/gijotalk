import React from 'react';
import { CategoryId } from '../types';
import {
  Star,
  Layers,
  Flag,
  Plane,
  Hotel,
  Bus,
  Utensils,
  Soup,
  Tag,
  Camera,
  Sparkles,
  Heart,
  MessageCircleWarning,
  AlertTriangle,
} from 'lucide-react';

interface CategoryChipsProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  categoryCounts?: Record<CategoryId, number>;
}

const CATEGORIES: { id: CategoryId; icon: React.ReactNode }[] = [
  { id: '10대 기본', icon: <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> },
  { id: '전체', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: '골프', icon: <Flag className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" /> },
  { id: '호텔', icon: <Hotel className="w-3.5 h-3.5" /> },
  { id: '교통', icon: <Bus className="w-3.5 h-3.5" /> },
  { id: '식당', icon: <Utensils className="w-3.5 h-3.5" /> },
  { id: '음식', icon: <Soup className="w-3.5 h-3.5" /> },
  { id: '흥정', icon: <Tag className="w-3.5 h-3.5" /> },
  { id: '관광', icon: <Camera className="w-3.5 h-3.5" /> },
  { id: '마사지', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: '항공', icon: <Plane className="w-3.5 h-3.5" /> },
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
    <div className="flex flex-wrap gap-1.5 pb-1 pt-0.5">
      {CATEGORIES.map((c) => {
        const active = selectedCategory === c.id;
        const isEssential = c.id === '10대 기본';
        const isEmergencyCat = c.id === '비상';
        const count = categoryCounts ? categoryCounts[c.id] : undefined;

        return (
          <button
            key={c.id}
            onClick={() => onSelectCategory(c.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 shadow-xs ${
              active
                ? isEssential
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-[1.02] ring-2 ring-amber-400'
                  : 'bg-brand text-white shadow-md shadow-brand-vivid/30 scale-[1.02]'
                : isEssential
                ? 'bg-amber-50 text-amber-900 border-2 border-amber-300 hover:bg-amber-100'
                : isEmergencyCat
                ? 'bg-accent/20 text-alert border-2 border-accent/60 hover:bg-accent/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50/60'
            }`}
          >
            {c.icon}
            <span>{c.id}</span>
            {count !== undefined && !isEssential && (
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            )}
            {isEssential && (
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-200/80 text-amber-900 rounded-full font-black">
                10
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
