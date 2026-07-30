import { Modal } from './Modal';
import React, { useState, useEffect } from 'react';
import { ListeningPlayer } from '../hooks/useListeningPlayer';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Headphones,
  Sparkles,
  ListMusic,
  Clock,
  Repeat,
} from 'lucide-react';

interface ListeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: ListeningPlayer;
}

/**
 * 전체 화면 연속 듣기 플레이어.
 *
 * 재생 엔진은 App 의 useListeningPlayer 가 들고 있습니다.
 * 이 컴포넌트는 순수하게 보여주고 조작만 합니다 — 닫아도 재생은 계속됩니다.
 */
export const ListeningModal: React.FC<ListeningModalProps> = ({ isOpen, onClose, player }) => {
  const [showPlaylist, setShowPlaylist] = useState(false);

  const {
    phrases,
    country,
    currentIndex,
    currentPhrase,
    isPlaying,
    repeatProgress,
    speed,
    setSpeed,
    repeatCount,
    setRepeatCount,
    intervalGap,
    setIntervalGap,
  } = player;

  // ESC · 포커스 트랩 · 배경 스크롤 잠금은 Modal 이 공통으로 처리합니다.
  // 여기서 닫아도 재생은 계속됩니다 — 엔진이 App 에 있기 때문입니다.
  if (!isOpen || !currentPhrase) return null;

  const settingRows: Array<{
    icon: React.ReactNode;
    label: string;
    options: number[];
    value: number;
    onChange: (v: number) => void;
    suffix: string;
    dark?: boolean;
  }> = [
    {
      icon: <Repeat className="w-4 h-4 text-brand" />,
      label: '반복 횟수',
      options: [1, 2, 3],
      value: repeatCount,
      onChange: setRepeatCount,
      suffix: '회',
    },
    {
      icon: <Clock className="w-4 h-4 text-brand" />,
      label: '쉬는 간격',
      options: [1, 2, 3],
      value: intervalGap,
      onChange: setIntervalGap,
      suffix: '초',
    },
    {
      icon: <Volume2 className="w-4 h-4 text-brand" />,
      label: '재생 속도',
      options: [0.8, 1.0, 1.2],
      value: speed,
      onChange: setSpeed,
      suffix: 'x',
      dark: true,
    },
  ];

  return (
    <Modal
      onClose={onClose}
      label="연속 듣기 플레이어"
      variant="sheet"
      className="animate-in fade-in duration-200"
      panelClassName="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-4 duration-200"
    >
        {/* Header */}
        <div className="bg-brand text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-white/20 rounded-2xl shrink-0">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <span>{country.flag}</span>
                <span className="truncate">연속 듣기</span>
              </h3>
              <p className="text-xs text-white/80 font-medium">
                {country.name} · {currentIndex + 1} / {phrases.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="접기 (재생은 계속됩니다)"
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* 현재 문장 */}
          <div className="bg-ink text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            {isPlaying && (
              <div className="absolute inset-0 bg-brand-vivid/10 animate-pulse pointer-events-none" />
            )}

            <div className="flex items-center justify-between mb-4 text-xs relative">
              <span className="bg-white/10 text-amber-200 font-bold px-3 py-1 rounded-full border border-amber-400/30">
                {currentPhrase.category}
              </span>
              <span className="bg-white/10 text-white font-mono px-2.5 py-1 rounded-full">
                반복 {repeatProgress}/{repeatCount}
              </span>
            </div>

            {/* 위계: 원문 → 발음 → 뜻 */}
            <div className="relative space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                {currentPhrase.original}
              </h2>
              <p className="inline-block bg-accent text-ink px-3 py-1 rounded-xl text-base font-bold">
                {currentPhrase.pronunciation}
              </p>
              <p className="text-sm font-medium text-slate-300 pt-1">
                {currentPhrase.translation}
              </p>
            </div>

            {currentPhrase.toneGuide && (
              <div className="mt-4 bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-slate-300 flex items-start gap-2 relative">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>{currentPhrase.toneGuide}</span>
              </div>
            )}
          </div>

          {/* 설정 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            {settingRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between text-sm font-bold text-ink-soft"
              >
                <span className="flex items-center gap-1.5 text-ink">
                  {row.icon} {row.label}
                </span>
                <div className="flex gap-1.5" role="group" aria-label={row.label}>
                  {row.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => row.onChange(opt)}
                      aria-pressed={row.value === opt}
                      className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
                        row.value === opt
                          ? row.dark
                            ? 'bg-ink text-white'
                            : 'bg-brand text-white'
                          : 'bg-white border border-slate-200 text-ink-soft hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                      {row.suffix}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 재생목록 */}
          <div>
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              aria-expanded={showPlaylist}
              className="w-full flex items-center justify-between p-3 bg-slate-100 hover:bg-slate-200/80 rounded-2xl text-sm font-bold text-ink-soft transition-colors"
            >
              <span className="flex items-center gap-2">
                <ListMusic className="w-4 h-4" />
                전체 재생목록 ({phrases.length}개)
              </span>
              <span className="text-xs text-ink-mute">
                {showPlaylist ? '접기 ▲' : '보기 ▼'}
              </span>
            </button>

            {showPlaylist && (
              <div className="mt-2 max-h-56 overflow-y-auto space-y-1.5 p-1 border border-slate-200 rounded-2xl bg-white shadow-inner">
                {phrases.map((p, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={p.id}
                      onClick={() => player.play(idx)}
                      aria-current={isActive}
                      className={`w-full text-left p-2.5 rounded-xl text-sm flex items-center justify-between gap-2 transition-all ${
                        isActive
                          ? 'bg-brand-tint border border-brand-vivid font-bold text-ink'
                          : 'hover:bg-slate-50 text-ink-soft border border-transparent'
                      }`}
                    >
                      <span className="truncate">
                        <span className="text-ink-mute mr-2 font-mono text-xs">{idx + 1}.</span>
                        <span className="font-bold text-ink mr-2">{p.original}</span>
                        <span className="text-ink-mute text-xs">({p.translation})</span>
                      </span>
                      {isActive && isPlaying && (
                        <span className="w-2 h-2 rounded-full bg-brand-vivid animate-ping shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 재생 컨트롤 */}
        <div
          className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-center gap-5 shrink-0"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={player.prev}
            aria-label="이전 문장"
            className="w-12 h-12 flex items-center justify-center bg-white hover:bg-slate-50 active:scale-95 text-ink rounded-2xl border border-slate-200 shadow-xs transition-transform"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={player.toggle}
            aria-label={isPlaying ? '일시정지' : '재생'}
            className={`w-16 h-16 rounded-full text-white shadow-md active:scale-95 transition-all flex items-center justify-center ${
              isPlaying ? 'bg-ink' : 'bg-brand hover:bg-brand-hover'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" fill="currentColor" />
            ) : (
              <Play className="w-7 h-7 ml-1" fill="currentColor" />
            )}
          </button>

          <button
            onClick={player.next}
            aria-label="다음 문장"
            className="w-12 h-12 flex items-center justify-center bg-white hover:bg-slate-50 active:scale-95 text-ink rounded-2xl border border-slate-200 shadow-xs transition-transform"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
    </Modal>
  );
};
