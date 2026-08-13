import React from 'react';
import { BASE_URL } from '../utils/env';
import { Modal } from './Modal';
import { X, ExternalLink } from 'lucide-react';

/**
 * 저녁 자리용 파티 게임(GIJO Drink) 실행 창.
 *
 * 게임 본체는 React 가 아니라 `public/game/gijo-drink.html` 한 장짜리 정적 페이지입니다
 * (GIJO Labs 의 GIJO_Drink v3.0.1 을 그대로 옮겼습니다). 앱에 흡수하지 않고 파일째
 * 둔 이유는 두 가지입니다.
 *   · 저쪽 저장소에서 게임이 갱신되면 파일 3개만 덮어쓰면 끝납니다.
 *   · 게임은 화면을 통째로 쓰는 다크 네온 UI 라 이 앱의 밝은 테마와 섞이지 않습니다.
 *
 * 새 탭 대신 iframe 을 쓰는 이유:
 *   홈 화면에 설치한 PWA 에서 target="_blank" 를 누르면 앱 창을 벗어나 브라우저가
 *   따로 뜹니다. iOS 는 그 둘의 저장소·서비스워커가 분리돼 있어서, 애써 받아둔
 *   오프라인 캐시가 없는 쪽으로 넘어가 인터넷이 없으면 게임이 아예 안 열립니다.
 *   iframe 이면 앱 창 안에 그대로 남습니다. 그래도 필요하면 새 창 버튼이 있습니다.
 *
 * 모드 목록을 보여주는 별도 카드가 없는 이유:
 *   게임 자신의 첫 화면이 이미 모드 6개를 아이콘과 함께 보여주는 메뉴입니다.
 *   여기서 한 번 더 나열하면 그대로 중복입니다.
 */

/** 배포 위치를 따라갑니다 — Pages 서브패스('/저장소이름/')든 루트든 그대로 맞습니다. */
const GAME_URL = `${BASE_URL}game/gijo-drink.html`;

interface PartyGameModalProps {
  onClose: () => void;
}

export const PartyGameModal: React.FC<PartyGameModalProps> = ({ onClose }) => {
  return (
    // 실수로 배경을 눌러 게임이 닫히면 진행 중이던 판이 날아갑니다.
    <Modal
      onClose={onClose}
      label="GIJO Drink 파티 게임"
      variant="fullscreen"
      closeOnBackdrop={false}
      panelClassName="w-full h-full bg-[#0a0a0c] flex flex-col"
    >
      {/* 게임 본체에는 뒤로 가는 길이 없습니다. 닫기 줄은 여기서 붙여줍니다. */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b border-white/10 shrink-0"
        style={{ paddingTop: 'calc(0.5rem + env(safe-area-inset-top))' }}
      >
        <span className="text-xs font-extrabold text-white/80 flex-1 truncate">
          GIJO Drink · 파티 게임
        </span>

        {/* iframe 안에서 소리나 진동이 막히는 기기를 위한 탈출구입니다. */}
        <a
          href={GAME_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="게임을 새 창에서 열기"
          title="새 창에서 열기"
          className="p-2 text-white/60 hover:text-white rounded-full active:scale-95 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
        <button
          onClick={onClose}
          aria-label="게임 닫기"
          className="p-2 text-white/60 hover:text-white rounded-full active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <iframe
        src={GAME_URL}
        title="GIJO Drink 파티 게임"
        // 게임은 소리와 진동을 씁니다. 같은 출처라도 명시하지 않으면 막는 브라우저가 있습니다.
        allow="autoplay; fullscreen"
        className="flex-1 w-full border-0 bg-[#0a0a0c]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      />
    </Modal>
  );
};
