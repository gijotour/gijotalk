import React from 'react';
import { Country, Phrase } from '../types';
import { Star } from 'lucide-react';
import { PhraseCard } from './PhraseCard';

interface Top10EssentialsProps {
  country: Country;
  phrases: Phrase[];
  onOpenBillboard: (phrase: Phrase) => void;
  speed: number;
  onSetSpeed: (speed: number) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
  onOpenMicPractice?: (phrase: Phrase) => void;
}

interface EssentialData {
  id: string;
  category: Phrase['category'];
  meaning: string;
  original: string;
  pronunciation: string;
  tip?: string;
  audio?: string;
}

// 🇻🇳 베트남 / 🇵🇭 필리핀 / 🇺🇸 영어 - 초간단 생존 10대 기본 표현
const ESSENTIALS_DATA: Record<string, EssentialData[]> = {
  vn: [
    { id: 'vn-soc-01', category: '미팅/사교', meaning: '안녕하세요', original: 'Xin chào!', pronunciation: '씬 짜오!', tip: '가장 널리 쓰이는 베트남 표준 인사말' },
    { id: 'vn-12', category: '흥정', meaning: '감사합니다', original: 'Cảm ơn nhiều!', pronunciation: '깜 언 니에우!', tip: '가장 많이 쓰는 감사 표현', audio: 'vn/vn-12.mp3' },
    { id: 'vn-soc-04', category: '미팅/사교', meaning: '죄송합니다 / 실례합니다', original: 'Xin lỗi', pronunciation: '신 로이', tip: '사과하거나 사람을 부를 때', audio: 'vn/vn-soc-04.mp3' },
    { id: 'vn-soc-15', category: '미팅/사교', meaning: '네 (알겠습니다)', original: 'Vâng', pronunciation: '벙', tip: '정중한 긍정 대답', audio: 'vn/vn-soc-15.mp3' },
    { id: 'vn-soc-12', category: '미팅/사교', meaning: '아니요, 괜찮습니다', original: 'Tôi không quan tâm. Cảm ơn.', pronunciation: '또이 콤 꽌 떰. 깜 언', tip: '호객 행위를 정중히 거절할 때', audio: 'vn/vn-soc-12.mp3' },
    { id: 'vn-02', category: '흥정', meaning: '얼마예요?', original: 'Bao nhiêu tiền?', pronunciation: '바오 니에우 띠엔?', tip: '물건 살 때 가격 질문', audio: 'vn/vn-02.mp3' },
    { id: 'vn-03', category: '흥정', meaning: '너무 비싸요, 깎아주세요!', original: 'Đắt quá, giảm giá đi!', pronunciation: '닷 꽈, 잠 자 디!', tip: '시장이나 상점 흥정 시 필수', audio: 'vn/vn-03.mp3' },
    { id: 'vn-08', category: '관광', meaning: '화장실 어디예요?', original: 'Nhà vệ sinh ở đâu?', pronunciation: '냐 베 신 어 더우?', tip: '식당이나 카페에서 화장실 찾을 때', audio: 'vn/vn-08.mp3' },
    { id: 'vn-09', category: '비상', meaning: '도와주세요! 살려주세요!', original: 'Cứu tôi với!', pronunciation: '끄우 또이 버이!', tip: '긴급 상황 구조 요청', audio: 'vn/vn-09.mp3' },
    { id: 'vn-18', category: '미팅/사교', meaning: '다음에 또 만나요! / 잘 가요', original: 'Hẹn gặp lại nhé!', pronunciation: '헨 갑 라이 냬!', tip: '헤어질 때 따뜻한 작별 인사', audio: 'vn/vn-18.mp3' },
  ],
  ph: [
    { id: 'ph-soc-01', category: '미팅/사교', meaning: '안녕하세요', original: 'Kumusta!', pronunciation: '쿠무스타!', tip: '필리핀의 대표적인 표준 인사' },
    { id: 'ph-soc-03', category: '미팅/사교', meaning: '감사합니다', original: 'Salamat po!', pronunciation: '살라맛 포!', tip: '가장 많이 쓰는 감사 인사 (po는 존칭)', audio: 'ph/ph-soc-03.m4a' },
    { id: 'ph-soc-04', category: '미팅/사교', meaning: '죄송합니다 / 실례합니다', original: 'Pasensya na po', pronunciation: '파센샤 나 포', tip: '사과할 때나 길을 비켜달라고 할 때', audio: 'ph/ph-soc-04.m4a' },
    { id: 'ph-01', category: '미팅/사교', meaning: '네', original: 'Opo', pronunciation: '오포', tip: '존칭 긍정 대답' },
    { id: 'ph-soc-18', category: '미팅/사교', meaning: '아니요, 괜찮습니다', original: 'Hindi po ako interesado. Salamat.', pronunciation: '힌디 포 아코 인테레사도. 살라맛', tip: '호객 정중 거절', audio: 'ph/ph-soc-18.m4a' },
    { id: 'ph-02', category: '흥정', meaning: '얼마예요?', original: 'Magkano po ito?', pronunciation: '막카노 포 이토?', tip: '가격 문의', audio: 'ph/ph-02.m4a' },
    { id: 'ph-05', category: '흥정', meaning: '너무 비싸요, 깎아주세요!', original: 'Masyadong mahal, bawas naman!', pronunciation: '마샤동 마할, 바와스 나만!', tip: '시장 흥정 필수', audio: 'ph/ph-05.m4a' },
    { id: 'ph-tur-08', category: '관광', meaning: '화장실 어디예요?', original: 'Nasaan po ang CR?', pronunciation: '나사안 포 앙 시알?', tip: '필리핀에서는 화장실을 CR(Comfort Room)이라고 부릅니다.', audio: 'ph/ph-tur-08.m4a' },
    { id: 'ph-09', category: '비상', meaning: '도와주세요! 조심하세요!', original: 'Tulong! Paki-ingat!', pronunciation: '툴롱! 파키잉앗!', tip: '긴급 구조 요청', audio: 'ph/ph-09.m4a' },
    { id: 'ph-soc-15', category: '미팅/사교', meaning: '다음에 또 만나요! / 잘 가요', original: 'Magkita tayo ulit!', pronunciation: '막키타 타요 울릿!', tip: '작별 인사', audio: 'ph/ph-soc-15.m4a' },
  ],
  en: [
    { id: 'en-soc-04', category: '미팅/사교', meaning: '안녕하세요!', original: 'Hello! / Hi!', pronunciation: '헬로! / 하이!', tip: '기본 인사' },
    { id: 'en-soc-01', category: '미팅/사교', meaning: '정말 감사합니다.', original: 'Thank you so much.', pronunciation: '땡큐 쏘 머치.', tip: '기본 감사', audio: 'en/en-soc-01.m4a' },
    { id: 'en-eme-02', category: '미팅/사교', meaning: '죄송합니다 / 실례합니다', original: 'Sorry / Excuse me', pronunciation: '쏘리 / 익스큐즈 미', tip: '사과 또는 호칭' },
    { id: 'en-soc-08', category: '미팅/사교', meaning: '네, 좋습니다', original: 'Yes, please.', pronunciation: '예스, 플리즈.', tip: '긍정 대답' },
    { id: 'en-soc-18', category: '미팅/사교', meaning: '아니요, 괜찮습니다. 관심 없어요.', original: 'No, thank you. I\'m not interested.', pronunciation: '노, 땡큐. 아임 낫 인터레스티드.', tip: '거절', audio: 'en/en-soc-18.m4a' },
    { id: 'en-bar-01', category: '흥정', meaning: '이거 얼마인가요?', original: 'How much is this?', pronunciation: '하우 머치 이즈 디스?', tip: '가격 문의', audio: 'en/en-bar-01.m4a' },
    { id: 'en-bar-02', category: '흥정', meaning: '좀 깎아주실 수 있나요?', original: 'Can you give me a discount?', pronunciation: '캔 유 기브 미 어 디스카운트?', tip: '할인 요청', audio: 'en/en-bar-02.m4a' },
    { id: 'en-tur-08', category: '관광', meaning: '화장실 어디예요?', original: 'Where is the comfort room?', pronunciation: '웨어 이즈 더 컴포트 룸?', tip: '화장실 문의', audio: 'en/en-tur-08.m4a' },
    { id: 'en-eme-01', category: '비상', meaning: '저 좀 도와주세요!', original: 'Please help me!', pronunciation: '플리즈 헬프 미!', tip: '긴급 요청', audio: 'en/en-eme-01.m4a' },
    { id: 'en-bar-05', category: '미팅/사교', meaning: '그냥 구경만 할게요, 감사합니다.', original: 'I\'m just looking, thank you.', pronunciation: '아임 저스트 루킹, 땡큐.', tip: '상점에서 둘러볼 때', audio: 'en/en-bar-05.m4a' },
  ],
};

export const Top10Essentials: React.FC<Top10EssentialsProps> = ({
  country,
  phrases,
  onOpenBillboard,
  speed,
  onSetSpeed,
  isBookmarked,
  onToggleBookmark,
  onOpenMicPractice = () => {},
}) => {
  const rawList = ESSENTIALS_DATA[country.id] || ESSENTIALS_DATA.en;

  return (
    <div className="bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-100/30 border-2 border-amber-300/90 p-3.5 sm:p-4 rounded-3xl shadow-sm space-y-3">
      {/* 10대 기본표현 섹션 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-amber-600 to-orange-500 text-white rounded-2xl shadow-xs">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>{country.name} 여행 필수 10대 기본 표현</span>
              <span className="text-[10px] px-2.5 py-0.5 bg-amber-500 text-white rounded-full font-black shadow-xs">
                TOP 10
              </span>
            </h2>
            <p className="text-xs text-slate-700 font-bold mt-0.5">
              공항·식당·호텔에서 바로 쓰는 1초 생존 표현
            </p>
          </div>
        </div>
      </div>

      {/* 동일한 PhraseCard 템플릿으로 10대 표현 렌더링 */}
      <div className="space-y-2.5">
        {rawList.map((item, idx) => {
          const phraseObj: Phrase = {
            id: item.id,
            countryId: country.id,
            category: item.category,
            original: item.original,
            translation: item.meaning,
            pronunciation: item.pronunciation,
            usageTip: item.tip,
            // 음성은 audioManifest 가 phrase.id 로 찾습니다 — Phrase 타입에 없는 audio 필드를 넣으면 tsc 가 막습니다.
            isEmergency: item.category === '비상',
          };

          return (
            <PhraseCard
              key={`top10-card-${country.id}-${idx}`}
              phrase={phraseObj}
              country={country}
              speed={speed}
              onSetSpeed={onSetSpeed}
              isBookmarked={isBookmarked(item.id)}
              onToggleBookmark={onToggleBookmark}
              onOpenBillboard={onOpenBillboard}
              onOpenMicPractice={onOpenMicPractice}
              index={idx}
              defaultExpanded={idx === 0}
            />
          );
        })}
      </div>
    </div>
  );
};
