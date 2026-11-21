import React from 'react';
import { Modal } from './Modal';
import { Gamepad2, PartyPopper, Trophy, Spade, X, ChevronRight, WifiOff } from 'lucide-react';

interface GameHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPartyGame: () => void;
  onOpenArcade: () => void;
  onOpenCasino: () => void;
}

export const GameHubModal: React.FC<GameHubModalProps> = ({
  isOpen,
  onClose,
  onOpenPartyGame,
  onOpenArcade,
  onOpenCasino,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      onClose={onClose}
      label="GIJO 게임 및 놀거리 라운지"
      variant="center"
      panelClassName="bg-white border border-slate-200 rounded-3xl p-5 w-full max-w-md max-h-[90dvh] overflow-y-auto shadow-xl text-ink animate-in zoom-in-95 duration-150"
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-2xl bg-slate-100 text-ink flex items-center justify-center shrink-0">
            <Gamepad2 className="w-5 h-5 text-brand" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-black tracking-tight text-ink">
              GIJO 게임 라운지
            </h2>
            <p className="text-xs text-ink-mute font-medium mt-0.5">
              혼자 · 모임 · 카지노 룰 연습
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-ink-soft hover:text-ink transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 심플 3카드 선택 */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenPartyGame();
          }}
          aria-label="GIJO Drink 시작하기"
          className="w-full text-left bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 transition-colors active:scale-[0.99]"
        >
          <span className="w-11 h-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <PartyPopper className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-ink">모임 게임</h3>
              <span className="text-[11px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                2~12인
              </span>
            </div>
            <p className="text-xs text-ink-mute font-medium mt-0.5 truncate">
              GIJO Drink · 폰 한 대로 여럿이 하는 게임
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenArcade();
          }}
          aria-label="GIJO Arcade 시작하기"
          className="w-full text-left bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 transition-colors active:scale-[0.99]"
        >
          <span className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-ink">혼자 하는 게임</h3>
              <span className="text-[11px] font-bold text-ink-soft bg-slate-200/70 px-2 py-0.5 rounded-full">
                1인용
              </span>
            </div>
            <p className="text-xs text-ink-mute font-medium mt-0.5 truncate">
              GIJO Arcade · 777 슬롯 · 퍼즐 등 11종
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenCasino();
          }}
          aria-label="GIJO Casino 룰 연습 시작하기"
          className="w-full text-left bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 transition-colors active:scale-[0.99]"
        >
          <span className="w-11 h-11 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center shrink-0">
            <Spade className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-ink">카지노 룰 연습판</h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-600/10 px-2 py-0.5 rounded-full">
                가상 칩
              </span>
            </div>
            <p className="text-xs text-ink-mute font-medium mt-0.5 truncate">
              GIJO Casino · 블랙잭 · 바카라 등 10종
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
      </div>

      {/* 안내 */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-ink-mute font-medium">
        <WifiOff className="w-3.5 h-3.5 text-emerald-600" />
        <span>인터넷 없이 100% 오프라인 작동</span>
      </div>
    </Modal>
  );
};
