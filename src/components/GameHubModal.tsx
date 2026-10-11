import React from 'react';
import { Modal } from './Modal';
import {
  Gamepad2,
  PartyPopper,
  Flame,
  Sparkles,
  Plane,
  X,
  ChevronRight,
  WifiOff,
  Dices,
  Trophy,
} from 'lucide-react';

interface GameHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPartyGame: () => void;
  onOpenArcade: () => void;
}

export const GameHubModal: React.FC<GameHubModalProps> = ({
  isOpen,
  onClose,
  onOpenPartyGame,
  onOpenArcade,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      onClose={onClose}
      label="GIJO 게임 및 놀거리 라운지"
      variant="center"
      panelClassName="bg-slate-900 border-2 border-purple-500/40 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl text-white relative animate-in zoom-in-95 duration-150 overflow-hidden"
    >
      {/* 배경 장식 글로우 */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/30">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>GIJO 게임 라운지</span>
              <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-black text-white uppercase tracking-wider">
                HUB
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              비행기 킬링타임 & 여행지 저녁 술자리 파티 게임
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 게임 목록 카드들 */}
      <div className="space-y-4 relative z-10">
        {/* 1. GIJO Drink 카드 */}
        <div className="bg-gradient-to-br from-slate-800/95 via-slate-800/80 to-purple-950/40 border border-purple-500/30 rounded-2xl p-4 transition-all hover:border-purple-400/60 shadow-lg">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-pink-500/20 text-pink-400 rounded-xl">
                <PartyPopper className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>GIJO Drink</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded-full flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5 fill-pink-400 text-pink-400" />
                    2~12인 술자리 파티
                  </span>
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-medium mb-3">
            미션 룰렛 &amp; 19+ 러브 드링크 / 터치 룰렛. 인원과 벌칙을 직접 수정할 수 있는 현장 맞춤형 술게임!
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3 text-[11px] text-slate-400">
            <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-700/50 flex items-center gap-1.5">
              <Dices className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span>미션 룰렛 &amp; 직접 수정</span>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-700/50 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>19+ 러브 &amp; 터치 룰렛</span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenPartyGame();
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 active:scale-98 text-white rounded-xl font-black text-xs shadow-md shadow-pink-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <span>🍹 GIJO Drink 시작하기</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2. GIJO Arcade 카드 */}
        <div className="bg-gradient-to-br from-slate-800/95 via-slate-800/80 to-amber-950/40 border border-amber-500/30 rounded-2xl p-4 transition-all hover:border-amber-400/60 shadow-lg">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-xl">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>GIJO Arcade</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                    <Plane className="w-2.5 h-2.5 text-amber-400" />
                    비행기 모드 1인용
                  </span>
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-medium mb-3">
            화려한 777 잭팟 슬롯머신 &amp; GIJO Neon 2048 &amp; Flappy Bird. 데이터 없이 즐기는 몰입형 아케이드!
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3 text-[11px] text-slate-400">
            <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-700/50 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>화려한 777 슬롯머신</span>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-700/50 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Neon 2048 &amp; Flappy</span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenArcade();
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 active:scale-98 text-white rounded-xl font-black text-xs shadow-md shadow-amber-500/30 flex items-center justify-center gap-2 transition-all"
          >
            <span>🎰 GIJO Arcade 시작하기</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 안내 뱃지 */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium relative z-10">
        <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
        <span>인터넷·데이터 연결 없이 100% 오프라인 동작</span>
      </div>
    </Modal>
  );
};
