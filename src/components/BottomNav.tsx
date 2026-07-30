import React from 'react';
import { Languages, Grid, Bookmark, ShieldAlert, Headphones } from 'lucide-react';

export type TabType = 'translate' | 'categories' | 'bookmarks' | 'emergency' | 'listening';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  bookmarkCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  bookmarkCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-orange-100 px-3 py-2.5 flex justify-around items-center shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
      {/* 1. Phrases / Main */}
      <button
        onClick={() => onChangeTab('translate')}
        className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all active:scale-90 ${
          activeTab === 'translate'
            ? 'bg-[#FF6B4A] text-white font-black shadow-xs'
            : 'text-slate-500 hover:text-slate-900 font-bold'
        }`}
      >
        <Languages className="w-5 h-5" />
        <span className="text-[10px]">회화/번역</span>
      </button>

      {/* 2. Categories */}
      <button
        onClick={() => onChangeTab('categories')}
        className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all active:scale-90 ${
          activeTab === 'categories'
            ? 'bg-[#FF6B4A] text-white font-black shadow-xs'
            : 'text-slate-500 hover:text-slate-900 font-bold'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px]">카테고리</span>
      </button>

      {/* 3. Bookmarks */}
      <button
        onClick={() => onChangeTab('bookmarks')}
        className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all relative active:scale-90 ${
          activeTab === 'bookmarks'
            ? 'bg-[#FF6B4A] text-white font-black shadow-xs'
            : 'text-slate-500 hover:text-slate-900 font-bold'
        }`}
      >
        <div className="relative">
          <Bookmark className="w-5 h-5" />
          {bookmarkCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#FFB800] text-slate-900 text-[9px] font-black px-1 rounded-full border border-white">
              {bookmarkCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">저장됨</span>
      </button>

      {/* 4. Emergency Billboard */}
      <button
        onClick={() => onChangeTab('emergency')}
        className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all active:scale-90 ${
          activeTab === 'emergency'
            ? 'bg-[#FFB800] text-slate-900 font-black shadow-xs'
            : 'text-[#D97706] hover:text-[#b45309] font-bold'
        }`}
      >
        <ShieldAlert className="w-5 h-5 text-[#D97706]" />
        <span className="text-[10px]">긴급전광판</span>
      </button>

      {/* 5. Continuous Listening Mode Tab */}
      <button
        onClick={() => onChangeTab('listening')}
        className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all active:scale-90 ${
          activeTab === 'listening'
            ? 'bg-slate-900 text-white font-black shadow-xs'
            : 'text-slate-500 hover:text-slate-900 font-bold'
        }`}
      >
        <Headphones className="w-5 h-5" />
        <span className="text-[10px]">연속듣기</span>
      </button>
    </nav>
  );
};
