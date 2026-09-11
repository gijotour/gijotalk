import React from 'react';
import { Maximize2, Star, Volume2 } from 'lucide-react';
import type { Country, Phrase, VocabExpression } from '../../types';
import {
  vocabAsPhrase,
  vocabDisplay,
  vocabPrimaryFor,
  type VocabItem,
} from '../../utils/vocab';

interface ExpressionListProps {
  expressions: VocabExpression[];
  country: Country;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onMarkSeen: (id: string) => void;
  playingId: string | null;
  onPlay: (item: VocabItem) => void;
  onOpenBillboard: (phrase: Phrase) => void;
}

/**
 * 짧은 말 단계 — 목록형 카드.
 *
 * 단어와 달리 한 장씩 넘기지 않습니다. 6개뿐이라 한눈에 훑는 편이 낫고,
 * 현장에서 "아까 그 말" 을 다시 찾을 때도 목록이 빠릅니다.
 */
export const ExpressionList: React.FC<ExpressionListProps> = ({
  expressions,
  country,
  savedIds,
  onToggleSave,
  onMarkSeen,
  playingId,
  onPlay,
  onOpenBillboard,
}) => {
  if (expressions.length === 0) {
    return (
      <p className="text-center text-xs font-bold text-ink-mute py-12">
        이 단원의 짧은 말은 아직 준비 중이에요.
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {expressions.map((expression) => {
        const display = vocabDisplay(expression, country.id);
        const saved = savedIds.includes(expression.id);
        const playing = playingId === expression.id;

        return (
          <li
            key={expression.id}
            className="bg-white border-2 border-slate-100 rounded-2xl p-3.5 shadow-xs space-y-2"
          >
            <p className="inline-block bg-accent text-ink px-3 py-1 rounded-xl text-lg font-black tracking-tight">
              {display.pronunciation}
            </p>
            <p className="text-sm font-extrabold text-slate-800 font-display">
              {display.text}
            </p>
            <p className="text-sm font-extrabold text-slate-900">{expression.meaning}</p>
            {display.subText && (
              <p className="text-xs font-bold text-ink-mute">
                {display.subText} {display.subPronunciation}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onMarkSeen(expression.id);
                  onPlay(expression);
                }}
                aria-label="소리 듣기"
                className={`flex-1 min-h-11 flex items-center justify-center gap-2 rounded-xl font-black text-xs shadow-xs active:scale-95 transition-all ${
                  playing ? 'bg-amber-400 text-ink animate-pulse' : 'bg-brand text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{playing ? '듣는 중…' : '소리 듣기'}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onOpenBillboard(vocabAsPhrase(expression, vocabPrimaryFor(country.id)))
                }
                aria-label="전광판으로 크게 보기"
                className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-alert active:scale-95"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onToggleSave(expression.id)}
                aria-label={saved ? '짧은 말 저장 취소' : '짧은 말 저장'}
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
          </li>
        );
      })}
    </ul>
  );
};
