import React from 'react';
import { GraduationCap, Languages, CalendarDays, ShieldAlert } from 'lucide-react';

/**
 * 하단 메인 메뉴 — 핵심 4개 탭으로 단순화.
 * · 배우기 : 10단원 학습 + 내 단어장·복습 퀴즈 통합
 * · 회화   : 현지 검색·카테고리 + 저장한 문장 필터 통합
 * · 일정   : 여행 일정표 · Grab · 지도
 * · 긴급   : 3초 현장 전광판
 */
export type TabType = 'learn' | 'translate' | 'itinerary' | 'emergency';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  bookmarkCount: number;
  vocabSavedCount?: number;
}

const TABS: Array<{
  id: TabType;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}> = [
  {
    id: 'learn',
    label: '배우기',
    icon: (active) => <GraduationCap className="w-5 h-5" strokeWidth={active ? 2.4 : 1.9} />,
  },
  {
    id: 'translate',
    label: '회화',
    icon: (active) => <Languages className="w-5 h-5" strokeWidth={active ? 2.4 : 1.9} />,
  },
  {
    id: 'itinerary',
    label: '일정',
    icon: (active) => <CalendarDays className="w-5 h-5" strokeWidth={active ? 2.4 : 1.9} />,
  },
  {
    id: 'emergency',
    label: '긴급',
    icon: (active) => <ShieldAlert className="w-5 h-5" strokeWidth={active ? 2.4 : 1.9} />,
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  bookmarkCount,
  vocabSavedCount = 0,
}) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 pt-1.5"
      style={{ paddingBottom: 'calc(0.4rem + env(safe-area-inset-bottom))' }}
      aria-label="주요 메뉴"
    >
      <div className="max-w-screen-md mx-auto flex justify-around items-center">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const isEmergency = tab.id === 'emergency';
          const badgeCount =
            tab.id === 'learn' ? vocabSavedCount : tab.id === 'translate' ? bookmarkCount : 0;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex-1 max-w-32 min-h-12 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors active:scale-95 ${
                active
                  ? isEmergency
                    ? 'text-alert font-black'
                    : 'text-brand font-black'
                  : isEmergency
                  ? 'text-slate-500 hover:text-alert font-semibold'
                  : 'text-slate-400 hover:text-slate-700 font-semibold'
              }`}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className={`absolute top-0 w-5 h-0.5 rounded-full ${
                    isEmergency ? 'bg-alert' : 'bg-brand'
                  }`}
                />
              )}
              <span className="relative">
                {tab.icon(active)}
                {badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-slate-900 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none border border-white">
                    {badgeCount}
                  </span>
                )}
              </span>
              <span className="text-[11px] leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
