import React from 'react';
import { BASE_URL } from '../utils/env';
import { Modal } from './Modal';
import { X, ExternalLink } from 'lucide-react';

/**
 * 오프라인 아케이드 게임(GIJO Arcade) 실행 창.
 *
 * 파티 게임(GIJO Drink)과 성격이 다릅니다.
 *   · 파티 게임 = 술자리에서 여럿이 한 폰을 돌려가며 하는 것
 *   · 아케이드  = 비행기·환승 대기처럼 혼자 시간을 때울 때 하는 것
 * 그래서 같은 메뉴에 섞지 않고 헤더에 각각 아이콘을 두었습니다.
 *
 * 게임 본체는 `public/game/gijo-arcade.html` 한 장짜리 정적 페이지입니다.
 * PartyGameModal 과 같은 이유로 새 탭이 아니라 iframe 으로 엽니다 — 설치형
 * PWA 에서 새 탭으로 나가면 서비스워커·캐시가 분리돼 오프라인에서 안 열립니다.
 * sw.js 가 `game/` 경로를 캐시 우선으로 잡고 있어서, 인터넷이 되는 곳에서 한 번만
 * 열어두면 그 뒤로는 비행기 안에서도 실행됩니다.
 */

/** 배포 위치를 따라갑니다 — Pages 서브패스('/저장소이름/')든 루트든 그대로 맞습니다. */
const GAME_URL = `${BASE_URL}game/gijo-arcade.html`;

interface ArcadeModalProps {
  onClose: () => void;
}

export const ArcadeModal: React.FC<ArcadeModalProps> = ({ onClose }) => {
  return (
    // 실수로 배경을 눌러 닫히면 하던 판이 날아갑니다.
    <Modal
      onClose={onClose}
      label="GIJO Arcade 오프라인 게임"
      variant="fullscreen"
      closeOnBackdrop={false}
      panelClassName="w-full h-full bg-[#0a0a0c] flex flex-col"
    >
      <div
        className="flex items-center gap-2 px-3 py-2 border-b border-white/10 shrink-0"
        style={{ paddingTop: 'calc(0.5rem + env(safe-area-inset-top))' }}
      >
        <span className="text-xs font-extrabold text-white/80 flex-1 truncate">
          GIJO Arcade · 오프라인 게임
        </span>

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
        title="GIJO Arcade 오프라인 게임"
        // 효과음과 진동을 씁니다. 같은 출처라도 명시하지 않으면 막는 브라우저가 있습니다.
        allow="autoplay; fullscreen"
        className="flex-1 w-full border-0 bg-[#0a0a0c]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      />
    </Modal>
  );
};
