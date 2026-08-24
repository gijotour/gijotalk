import React from 'react';
import { Country, Phrase } from '../types';
import { Sparkles, Volume2, Maximize2, Star } from 'lucide-react';
import { playPhrase, unlockAudioPlayback } from '../utils/speech';

interface Top10EssentialsProps {
  country: Country;
  phrases: Phrase[];
  onOpenBillboard: (phrase: Phrase) => void;
  speed: number;
}

export const Top10Essentials: React.FC<Top10EssentialsProps> = ({
  country,
  phrases,
  onOpenBillboard,
  speed,
}) => {
  // Find or match the 10 core expressions for current country
  const top10List = React.useMemo(() => {
    const list: Phrase[] = [];
    const usedIds = new Set<string>();

    const targetKeywords = [
      ['안녕', '반갑'],
      ['감사', '고맙'],
      ['실례', '죄송', '미안'],
      ['얼마', '가격'],
      ['깎아', '할인', '싸게'],
      ['화장실'],
      ['체크인', '예약'],
      ['계산', '영수증', '계산서'],
      ['도와', '살려', '도움'],
      ['물', '생수', '얼음물'],
    ];

    targetKeywords.forEach((keys) => {
      const found = phrases.find(
        (p) =>
          !usedIds.has(p.id) &&
          keys.some(
            (k) =>
              p.translation.includes(k) ||
              p.original.toLowerCase().includes(k) ||
              (p.usageTip && p.usageTip.includes(k))
          )
      );
      if (found) {
        usedIds.add(found.id);
        list.push(found);
      }
    });

    // If less than 10 found by keywords, fill up with top phrases
    if (list.length < 10) {
      phrases.forEach((p) => {
        if (list.length < 10 && !usedIds.has(p.id)) {
          usedIds.add(p.id);
          list.push(p);
        }
      });
    }

    return list.slice(0, 10);
  }, [phrases, country.id]);

  const handlePlay = (e: React.MouseEvent, phrase: Phrase) => {
    e.stopPropagation();
    unlockAudioPlayback();
    void playPhrase(phrase, country, speed);
  };

  if (top10List.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-2 border-amber-300/80 p-4 rounded-3xl shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500 text-white rounded-xl shadow-xs">
            <Star className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>{country.name} 여행 필수 10대 기본 표현</span>
              <span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-bold">
                TOP 10
              </span>
            </h2>
            <p className="text-[11px] text-slate-600 font-medium">
              도착하자마자 공항·택시·식당에서 가장 많이 쓰는 1초 생존 표현
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {top10List.map((phrase, idx) => (
          <div
            key={`top10-${phrase.id}`}
            onClick={() => onOpenBillboard(phrase)}
            className="bg-white hover:border-amber-400 p-3 rounded-2xl border-2 border-amber-100/80 flex items-center justify-between gap-2.5 cursor-pointer active:scale-95 transition-all shadow-xs group"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">
                    {phrase.original}
                  </h3>
                  <span className="text-[11px] text-rose-600 font-bold">
                    [{phrase.pronunciation}]
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-bold truncate">
                  {phrase.translation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={(e) => handlePlay(e, phrase)}
                aria-label={`${phrase.original} 발음 재생`}
                className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-colors active:scale-90"
                title="발음 듣기"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenBillboard(phrase);
                }}
                aria-label="전광판 크게 보기"
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition-colors"
                title="전광판 크게 보기"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
