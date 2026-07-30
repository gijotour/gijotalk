import React from 'react';
import { Languages, Bookmark, ShieldAlert } from 'lucide-react';

/**
 * 탭을 5개에서 3개로 줄였습니다.
 *
 * 없앤 것과 그 이유:
 *   · 카테고리  → 메인 화면의 카테고리 칩이 이미 같은 일을 합니다. 순수 중복이었습니다.
 *   · 연속듣기  → 기능 자체를 걷어냈습니다. 문장별 재생만으로 충분하다고 판단했습니다.
 */
export type TabType = 'translate' | 'bookmarks' | 'emergency';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  bookmarkCount: number;
}

const TABS: Array<{
  id: TabType;
  label: string;
  icon: React.ReactNode;
  activeClass: string;
  idleClass: string;
}> = [
  {
    id: 'translate',
    label: '회화',
    icon: <Languages className="w-6 h-6" />,
    activeClass: 'bg-brand text-white',
    idleClass: 'text-ink-soft hover:text-ink',
  },
  {
    id: 'bookmarks',
    label: '보관함',
    icon: <Bookmark className="w-6 h-6" />,
    activeClass: 'bg-brand text-white',
    idleClass: 'text-ink-soft hover:text-ink',
  },
  {
    id: 'emergency',
    label: '긴급',
    icon: <ShieldAlert className="w-6 h-6" />,
    activeClass: 'bg-accent text-ink',
    idleClass: 'text-alert hover:text-alert',
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  bookmarkCount,
}) => {
  // paddingBottom 에 safe-area 를 더해야 아이폰 홈 인디케이터에 버튼이 깔리지 않습니다.
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-orange-100 px-3 pt-2 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
      aria-label="주요 메뉴"
    >
      <div className="max-w-screen-md mx-auto flex justify-around items-center">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              aria-current={active ? 'page' : undefined}
              // 탭이 3개가 되면서 터치 영역을 넉넉히 잡을 수 있게 됐습니다.
              // 흔들리는 차 안에서 누르는 앱이라 여백이 곧 기능입니다.
              className={`flex-1 max-w-36 flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition-all active:scale-95 font-bold ${
                active ? tab.activeClass : tab.idleClass
              }`}
            >
              <span className="relative">
                {tab.icon}
                {tab.id === 'bookmarks' && bookmarkCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-accent text-ink text-xs font-bold min-w-5 px-1 rounded-full border-2 border-white">
                    {bookmarkCount}
                  </span>
                )}
              </span>
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
