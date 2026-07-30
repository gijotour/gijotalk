import React from 'react';
import { ListeningPlayer } from '../hooks/useListeningPlayer';
import { Play, Pause, SkipForward, ChevronUp, X } from 'lucide-react';

interface MiniPlayerProps {
  player: ListeningPlayer;
  onExpand: () => void;
}

/**
 * 하단 고정 미니 플레이어.
 *
 * 예전에는 연속 듣기가 전면 모달이라, 재생 중에는 문장 목록을 볼 수 없었습니다.
 * 이제 재생은 App 이 들고 있고 이 바가 항상 떠 있어서, 목록을 넘겨보는 동안에도
 * 이어폰으로는 계속 흘러나옵니다.
 */
export const MiniPlayer: React.FC<MiniPlayerProps> = ({ player, onExpand }) => {
  const { currentPhrase, isPlaying, isActive, currentIndex, phrases, repeatProgress, repeatCount } =
    player;

  if (!isActive || !currentPhrase) return null;

  return (
    <div
      className="fixed left-0 right-0 z-40 px-3"
      style={{ bottom: 'calc(4.25rem + env(safe-area-inset-bottom))' }}
      role="region"
      aria-label="연속 듣기 미니 플레이어"
    >
      <div className="max-w-screen-md mx-auto bg-ink text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        {/* 진행 표시 — 현재 몇 번째인지 한눈에 */}
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-brand-vivid transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / Math.max(phrases.length, 1)) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-2 p-2.5">
          {/* 문장 정보 — 누르면 전체 플레이어로 확대 */}
          <button
            onClick={onExpand}
            className="flex-1 min-w-0 text-left flex items-center gap-2.5 rounded-xl px-1 py-0.5"
            aria-label="전체 플레이어 열기"
          >
            <ChevronUp className="w-4 h-4 text-white/50 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-bold truncate leading-tight">{currentPhrase.original}</p>
              <p className="text-xs text-white/60 truncate leading-tight mt-0.5">
                {currentIndex + 1}/{phrases.length} · 반복 {repeatProgress}/{repeatCount} ·{' '}
                {currentPhrase.translation}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={player.toggle}
              aria-label={isPlaying ? '일시정지' : '재생'}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-brand-vivid text-white active:scale-95 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </button>

            <button
              onClick={player.next}
              aria-label="다음 문장"
              className="w-10 h-10 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={player.dismiss}
              aria-label="연속 듣기 종료"
              className="w-9 h-9 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
