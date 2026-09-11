import React, { useEffect, useRef, useState } from 'react';
import { ListVideo, Square, Star, Volume2 } from 'lucide-react';
import type { Country, VocabDialog } from '../../types';
import { dialogLineItems, vocabDisplay, type VocabItem } from '../../utils/vocab';

interface DialogViewProps {
  dialog?: VocabDialog;
  country: Country;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onMarkSeen: (id: string) => void;
  playingId: string | null;
  onPlay: (item: VocabItem, onEnd?: () => void) => void;
  onStop: () => void;
}

/**
 * 대화 단계 — 말풍선 4줄.
 *
 * 내 말은 오른쪽, 상대 말은 왼쪽. 카톡과 같은 배치라 설명이 필요 없습니다.
 * "전체 듣기" 는 `playPhrase` 의 onEnd 를 물고 다음 줄로 넘어갑니다 —
 * 타이머로 간격을 추측하면 문장 길이에 따라 어긋납니다.
 */
export const DialogView: React.FC<DialogViewProps> = ({
  dialog,
  country,
  savedIds,
  onToggleSave,
  onMarkSeen,
  playingId,
  onPlay,
  onStop,
}) => {
  const [autoPlaying, setAutoPlaying] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => () => {
    cancelledRef.current = true;
  }, []);

  if (!dialog || dialog.lines.length === 0) {
    return (
      <p className="text-center text-xs font-bold text-ink-mute py-12">
        이 단원의 대화는 아직 준비 중이에요.
      </p>
    );
  }

  const lines = dialogLineItems(dialog);

  const playFrom = (i: number) => {
    if (cancelledRef.current || i >= lines.length) {
      setAutoPlaying(false);
      return;
    }
    onMarkSeen(lines[i].id);
    onPlay(lines[i], () => playFrom(i + 1));
  };

  const handlePlayAll = () => {
    cancelledRef.current = false;
    setAutoPlaying(true);
    playFrom(0);
  };

  const handleStopAll = () => {
    cancelledRef.current = true;
    setAutoPlaying(false);
    onStop();
  };

  return (
    <div className="space-y-3">
      <div className="bg-white border-2 border-slate-100 rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-black text-slate-900 truncate">{dialog.title}</h3>
          <p className="text-xs font-bold text-ink-mute mt-0.5">
            두 사람이 주고받는 말이에요.
          </p>
        </div>
        {autoPlaying ? (
          <button
            type="button"
            onClick={handleStopAll}
            aria-label="전체 듣기 멈추기"
            className="min-h-11 px-4 shrink-0 flex items-center gap-2 rounded-xl bg-amber-400 text-ink text-xs font-black active:scale-95"
          >
            <Square className="w-4 h-4" />
            <span>멈추기</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePlayAll}
            aria-label="전체 듣기"
            className="min-h-11 px-4 shrink-0 flex items-center gap-2 rounded-xl bg-brand text-white text-xs font-black shadow-xs active:scale-95"
          >
            <ListVideo className="w-4 h-4" />
            <span>전체 듣기</span>
          </button>
        )}
      </div>

      <ul className="space-y-2.5">
        {lines.map((line) => {
          const display = vocabDisplay(line, country.id);
          const mine = line.speaker === 'me';
          const saved = savedIds.includes(line.id);
          const playing = playingId === line.id;

          return (
            <li
              key={line.id}
              className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl border-2 p-3 shadow-xs space-y-1.5 ${
                  mine
                    ? 'bg-brand-tint border-brand-vivid/40'
                    : 'bg-white border-slate-100'
                } ${playing ? 'ring-2 ring-accent' : ''}`}
              >
                <p className="text-xs font-black text-ink-mute">
                  {mine ? '나' : '상대'}
                </p>
                <p className="inline-block bg-accent text-ink px-2.5 py-0.5 rounded-xl text-base font-black">
                  {display.pronunciation}
                </p>
                <p className="text-xs font-extrabold text-slate-700 font-display">
                  {display.text}
                </p>
                <p className="text-sm font-extrabold text-slate-900">{line.meaning}</p>
                {display.subText && (
                  <p className="text-xs font-bold text-ink-mute">{display.subText}</p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onMarkSeen(line.id);
                      onPlay(line);
                    }}
                    aria-label="이 말 듣기"
                    className={`min-h-11 px-3 flex items-center gap-1.5 rounded-xl text-xs font-black active:scale-95 ${
                      playing ? 'bg-amber-400 text-ink animate-pulse' : 'bg-brand text-white'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>듣기</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleSave(line.id)}
                    aria-label={saved ? '이 말 저장 취소' : '이 말 저장'}
                    aria-pressed={saved}
                    className={`w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border-2 active:scale-95 ${
                      saved
                        ? 'bg-accent border-accent text-ink'
                        : 'bg-white border-slate-200 text-ink-mute'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
