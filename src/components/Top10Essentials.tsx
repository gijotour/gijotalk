import React from 'react';
import { Country, Phrase } from '../types';
import { Volume2, Maximize2, Star } from 'lucide-react';
import { playPhrase, unlockAudioPlayback } from '../utils/speech';

interface Top10EssentialsProps {
  country: Country;
  phrases: Phrase[];
  onOpenBillboard: (phrase: Phrase) => void;
  speed: number;
}

interface CorePhraseItem {
  meaning: string;
  original: string;
  pronunciation: string;
  category: Phrase['category'];
}

// 각 국가별 가장 기본적이고 쉬운 10대 필수 표현
const SIMPLE_TOP_10: Record<string, CorePhraseItem[]> = {
  ph: [
    { meaning: '안녕하세요', original: 'Kumusta', pronunciation: '쿠무스타', category: '미팅/사교' },
    { meaning: '감사합니다', original: 'Salamat', pronunciation: '살라맛', category: '미팅/사교' },
    { meaning: '죄송합니다 / 실례합니다', original: 'Pasensya na / Excuse me', pronunciation: '파센샤 나 / 익스큐즈미', category: '미팅/사교' },
    { meaning: '네 (예)', original: 'Opo', pronunciation: '오포', category: '미팅/사교' },
    { meaning: '아니요', original: 'Hindi po', pronunciation: '힌디 포', category: '미팅/사교' },
    { meaning: '얼마예요?', original: 'Magkano po ito?', pronunciation: '막카노 포 이토?', category: '흥정' },
    { meaning: '깎아주세요', original: 'Discount naman po', pronunciation: '디스카운트 나만 포', category: '흥정' },
    { meaning: '화장실 어디예요?', original: 'Nasaan ang CR?', pronunciation: '나사안 앙 시알?', category: '관광' },
    { meaning: '도와주세요!', original: 'Tulong po!', pronunciation: '툴롱 포!', category: '비상' },
    { meaning: '안녕히 계세요 / 잘 가요', original: 'Paalam / Bye', pronunciation: '파알람 / 바이', category: '미팅/사교' },
  ],
  vn: [
    { meaning: '안녕하세요', original: 'Xin chào', pronunciation: '씬 짜오', category: '미팅/사교' },
    { meaning: '감사합니다', original: 'Cảm ơn', pronunciation: '깜 언', category: '미팅/사교' },
    { meaning: '죄송합니다 / 실례합니다', original: 'Xin lỗi', pronunciation: '씬 로이', category: '미팅/사교' },
    { meaning: '네 (예)', original: 'Vâng / Dạ', pronunciation: '벙 / 야', category: '미팅/사교' },
    { meaning: '아니요', original: 'Không', pronunciation: '콩', category: '미팅/사교' },
    { meaning: '얼마예요?', original: 'Bao nhiêu tiền?', pronunciation: '바오 니에우 띠엔?', category: '흥정' },
    { meaning: '깎아주세요', original: 'Bớt đi', pronunciation: '벗 디', category: '흥정' },
    { meaning: '화장실 어디예요?', original: 'Nhà vệ sinh ở đâu?', pronunciation: '냐 베 신 어 더우?', category: '관광' },
    { meaning: '도와주세요!', original: 'Cứu tôi với!', pronunciation: '끄우 또이 버이!', category: '비상' },
    { meaning: '안녕히 계세요 / 잘 가요', original: 'Tạm biệt', pronunciation: '땀 비엣', category: '미팅/사교' },
  ],
  en: [
    { meaning: '안녕하세요', original: 'Hello! / Hi', pronunciation: '헬로우 / 하이', category: '미팅/사교' },
    { meaning: '감사합니다', original: 'Thank you!', pronunciation: '땡큐!', category: '미팅/사교' },
    { meaning: '죄송합니다 / 실례합니다', original: 'Excuse me / Sorry', pronunciation: '익스큐즈미 / 쏘리', category: '미팅/사교' },
    { meaning: '네 (예)', original: 'Yes, please', pronunciation: '예스, 플리즈', category: '미팅/사교' },
    { meaning: '아니요', original: 'No, thank you', pronunciation: '노, 땡큐', category: '미팅/사교' },
    { meaning: '얼마예요?', original: 'How much is this?', pronunciation: '하우 머치 이즈 디스?', category: '흥정' },
    { meaning: '깎아주세요', original: 'Discount, please', pronunciation: '디스카운트, 플리즈', category: '흥정' },
    { meaning: '화장실 어디예요?', original: 'Where is the restroom?', pronunciation: '웨어 이즈 더 레스트룸?', category: '관광' },
    { meaning: '도와주세요!', original: 'Help me, please!', pronunciation: '헬프 미, 플리즈!', category: '비상' },
    { meaning: '안녕히 계세요 / 잘 가요', original: 'Goodbye! / Bye', pronunciation: '굿바이 / 바이', category: '미팅/사교' },
  ],
};

export const Top10Essentials: React.FC<Top10EssentialsProps> = ({
  country,
  phrases,
  onOpenBillboard,
  speed,
}) => {
  const items = React.useMemo(() => {
    const rawList = SIMPLE_TOP_10[country.id] || SIMPLE_TOP_10.en;

    return rawList.map((item, idx) => {
      // Find matching existing phrase in dataset for recorded audio if available
      const matched = phrases.find(
        (p) =>
          p.translation.includes(item.meaning) ||
          p.original.toLowerCase().includes(item.original.toLowerCase().split('/')[0].trim())
      );

      const phraseObj: Phrase = {
        id: matched?.id || `simple-top10-${country.id}-${idx}`,
        countryId: country.id,
        category: item.category,
        original: item.original,
        translation: item.meaning,
        pronunciation: item.pronunciation,
        audio: matched?.audio,
        isEmergency: item.category === '비상',
      };

      return phraseObj;
    });
  }, [country.id, phrases]);

  const handlePlay = (e: React.MouseEvent, phrase: Phrase) => {
    e.stopPropagation();
    unlockAudioPlayback();
    void playPhrase(phrase, country, speed);
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-2 border-amber-300/80 p-4 rounded-3xl shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500 text-white rounded-xl shadow-xs">
            <Star className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>{country.name} 초간단 10대 기본 표현</span>
              <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-bold">
                초기본 10
              </span>
            </h2>
            <p className="text-[11px] text-slate-600 font-medium">
              안녕하세요·감사합니다 등 현지에서 1초 만에 바로 쓰는 가장 쉬운 표현
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((phrase, idx) => (
          <div
            key={phrase.id}
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
