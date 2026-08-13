import React, { useState } from 'react';
import { BASE_URL } from '../utils/env';
import { Modal } from './Modal';
import { PartyPopper, X, ExternalLink } from 'lucide-react';

/**
 * 저녁 자리용 파티 게임(GIJO Drink) 입구.
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
 */

/** 배포 위치를 따라갑니다 — Pages 서브패스('/저장소이름/')든 루트든 그대로 맞습니다. */
const GAME_URL = `${BASE_URL}game/gijo-drink.html`;

const GAME_MODES = [
  '미션 룰렛',
  '크로커다일 룰렛',
  '시간 폭탄',
  '터치 룰렛',
  '찰랑찰랑 타이타닉',
  '손가락 사다리',
];

export const PartyGameCard: React.FC = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <>
      {/* 카드는 앱에서 유일한 다크 블록입니다. 일정·회화 같은 '일'이 아니라
          저녁에 노는 것이라는 신호를 색으로 줍니다. */}
      <section className="bg-ink text-white rounded-2xl p-4 shadow-xs overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="bg-accent text-ink p-2 rounded-xl shrink-0">
            <PartyPopper className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold">GIJO Drink · 파티 게임</h2>
            <p className="text-xs font-bold text-white/60 mt-0.5 leading-relaxed">
              저녁 자리에서 폰 하나로 바로 켜는 게임입니다. 한 번 열어두면 인터넷 없이도
              실행됩니다.
            </p>
          </div>
        </div>

        {/* 모드 이름을 먼저 보여줍니다. "파티 게임" 만으로는 뭘 하는 건지 모릅니다. */}
        <ul className="flex flex-wrap gap-1.5 mt-3">
          {GAME_MODES.map((mode) => (
            <li
              key={mode}
              className="px-2.5 py-0.5 bg-white/10 text-white/80 text-xs font-bold rounded-xl"
            >
              {mode}
            </li>
          ))}
        </ul>

        <button
          onClick={() => setPlaying(true)}
          className="w-full mt-3 py-3 bg-accent text-ink text-xs font-extrabold rounded-xl active:scale-95 transition-all"
        >
          게임 시작
        </button>
      </section>

      {playing && (
        // 실수로 배경을 눌러 게임이 닫히면 진행 중이던 판이 날아갑니다.
        <Modal
          onClose={() => setPlaying(false)}
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
              onClick={() => setPlaying(false)}
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
      )}
    </>
  );
};
