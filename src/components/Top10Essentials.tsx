import React, { useState } from 'react';
import { Country, Phrase } from '../types';
import {
  Volume2,
  Maximize2,
  Bookmark,
  Star,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
} from 'lucide-react';
import { playPhrase, unlockAudioPlayback } from '../utils/speech';
import { track } from '../utils/analytics';

interface Top10EssentialsProps {
  country: Country;
  phrases: Phrase[];
  onOpenBillboard: (phrase: Phrase) => void;
  speed: number;
  onSetSpeed: (speed: number) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
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

// 100% 무조건 확실하게 나오는 국가별 10대 기본 필수 표현 (오디오 매핑 완비)
const ESSENTIALS_DATA: Record<string, EssentialData[]> = {
  ph: [
    { id: 'ph-soc-01', category: '미팅/사교', meaning: '안녕하세요, 잘 지내세요?', original: 'Kumusta po kayo?', pronunciation: '쿠무스타 포 카요?', tip: 'po는 존칭어입니다.', audio: 'ph/ph-soc-01.m4a' },
    { id: 'ph-soc-03', category: '미팅/사교', meaning: '감사합니다! 정말 친절하시네요.', original: 'Salamat po!', pronunciation: '살라맛 포!', tip: '가장 많이 쓰는 감사 인사', audio: 'ph/ph-soc-03.m4a' },
    { id: 'ph-soc-04', category: '미팅/사교', meaning: '죄송합니다 / 실례합니다', original: 'Pasensya na po', pronunciation: '파센샤 나 포', tip: '사과할 때나 길을 비켜달라고 할 때', audio: 'ph/ph-soc-04.m4a' },
    { id: 'ph-01', category: '미팅/사교', meaning: '네 (예, 알겠습니다)', original: 'Opo', pronunciation: '오포', tip: '존칭 긍정 대답' },
    { id: 'ph-soc-18', category: '미팅/사교', meaning: '아니요, 괜찮습니다 (관심 없어요)', original: 'Hindi po ako interesado. Salamat.', pronunciation: '힌디 포 아코 인테레사도. 살라맛.', tip: '호객 행위를 정중히 거절할 때', audio: 'ph/ph-soc-18.m4a' },
    { id: 'ph-02', category: '흥정', meaning: '이거 얼마인가요?', original: 'Magkano po ito?', pronunciation: '막카노 포 이토?', tip: '가격을 물어볼 때', audio: 'ph/ph-02.m4a' },
    { id: 'ph-05', category: '흥정', meaning: '너무 비싸요, 조금만 깎아주세요!', original: 'Masyadong mahal, bawas naman!', pronunciation: '마샤동 마할, 바와스 나만!', tip: '시장이나 툭툭이 흥정 시 필수', audio: 'ph/ph-05.m4a' },
    { id: 'ph-tur-08', category: '관광', meaning: '화장실이 어디예요?', original: 'Nasaan po ang CR?', pronunciation: '나사안 포 앙 시알?', tip: '필리핀에서는 화장실을 CR(Comfort Room)이라고 부릅니다.', audio: 'ph/ph-tur-08.m4a' },
    { id: 'ph-09', category: '비상', meaning: '도와주세요! 조심하세요!', original: 'Tulong! Paki-ingat!', pronunciation: '툴롱! 파키잉앗!', tip: '긴급 상황 도움 요청', audio: 'ph/ph-09.m4a' },
    { id: 'ph-soc-15', category: '미팅/사교', meaning: '잘 가요, 다음에 또 만나요!', original: 'Magkita tayo ulit!', pronunciation: '막키타 타요 울릿!', tip: '헤어질 때 기분 좋은 작별 인사', audio: 'ph/ph-soc-15.m4a' },
  ],
  vn: [
    { id: 'vn-soc-01', category: '미팅/사교', meaning: '안녕하세요, 잘 지내세요?', original: 'Chào anh/chị!', pronunciation: '짜오 안/찌!', tip: '베트남의 대표적인 인사말', audio: 'vn/vn-soc-01.mp3' },
    { id: 'vn-12', category: '미팅/사교', meaning: '정말 감사합니다!', original: 'Cảm ơn nhiều!', pronunciation: '깜 언 니에우!', tip: '식당이나 마사지 후 감사 인사', audio: 'vn/vn-12.mp3' },
    { id: 'vn-soc-04', category: '미팅/사교', meaning: '죄송합니다 / 실례합니다', original: 'Xin lỗi', pronunciation: '씬 로이', tip: '사과할 때나 부를 때', audio: 'vn/vn-soc-04.mp3' },
    { id: 'vn-soc-15', category: '미팅/사교', meaning: '네, 만나서 반가워요', original: 'Vâng, rất vui được gặp anh/chị', pronunciation: '벙, 젓 부이 드억 갑 안/찌', tip: '정중한 긍정 및 인사', audio: 'vn/vn-soc-15.mp3' },
    { id: 'vn-soc-12', category: '미팅/사교', meaning: '아니요, 괜찮습니다 (관심 없어요)', original: 'Tôi không quan tâm. Cảm ơn.', pronunciation: '또이 콩 꾸안 떰. 깜 언.', tip: '호객 거절할 때', audio: 'vn/vn-soc-12.mp3' },
    { id: 'vn-02', category: '흥정', meaning: '얼마예요?', original: 'Bao nhiêu tiền?', pronunciation: '바오 니에우 띠엔?', tip: '물건 살 때 가격 질문', audio: 'vn/vn-02.mp3' },
    { id: 'vn-03', category: '흥정', meaning: '너무 비싸요, 깎아주세요!', original: 'Đắt quá, giảm giá đi!', pronunciation: '닷 꾸아, 지암 자 디!', tip: '야시장이나 상점 흥정 시 필수', audio: 'vn/vn-03.mp3' },
    { id: 'vn-08', category: '관광', meaning: '화장실이 어디예요?', original: 'Nhà vệ sinh ở đâu?', pronunciation: '냐 베 신 어 더우?', tip: '식당이나 카페에서 화장실 찾을 때', audio: 'vn/vn-08.mp3' },
    { id: 'vn-09', category: '비상', meaning: '도와주세요! 살려주세요!', original: 'Cứu tôi với!', pronunciation: '끄우 또이 버이!', tip: '긴급 상황 외침', audio: 'vn/vn-09.mp3' },
    { id: 'vn-18', category: '미팅/사교', meaning: '잘 가요, 다음에 또 만나요!', original: 'Hẹn gặp lại nhé!', pronunciation: '헨 갑 라이 녜!', tip: '작별 인사', audio: 'vn/vn-18.mp3' },
  ],
  en: [
    { id: 'en-soc-04', category: '미팅/사교', meaning: '안녕하세요! 오늘 어떠세요?', original: 'Hi! How are you doing today?', pronunciation: '하이! 하우 아 유 두잉 투데이?', tip: '가장 자연스러운 인사', audio: 'en/en-soc-04.m4a' },
    { id: 'en-soc-01', category: '미팅/사교', meaning: '정말 감사합니다. 너무 친절하시네요.', original: 'Thank you so much.', pronunciation: '땡큐 쏘 머치.', tip: '기본 감사 인사', audio: 'en/en-soc-01.m4a' },
    { id: 'en-eme-02', category: '미팅/사교', meaning: '실례합니다 / 죄송합니다', original: 'Excuse me / Sorry', pronunciation: '익스큐즈 미 / 쏘리', tip: '사람을 부르거나 길을 비킬 때' },
    { id: 'en-soc-08', category: '미팅/사교', meaning: '네, 좋습니다 (네, 부탁해요)', original: 'Yes, please.', pronunciation: '예스, 플리즈.', tip: '정중한 수락' },
    { id: 'en-soc-18', category: '미팅/사교', meaning: '아니요, 괜찮습니다. 관심 없어요.', original: 'No, thank you. I\'m not interested.', pronunciation: '노, 땡큐. 아임 낫 인터레스티드.', tip: '정중한 거절', audio: 'en/en-soc-18.m4a' },
    { id: 'en-bar-01', category: '흥정', meaning: '이거 얼마인가요?', original: 'How much is this?', pronunciation: '하우 머치 이즈 디스?', tip: '가격 문의', audio: 'en/en-bar-01.m4a' },
    { id: 'en-bar-02', category: '흥정', meaning: '좀 깎아주실 수 있나요?', original: 'Can you give me a discount?', pronunciation: '캔 유 기브 미 어 디스카운트?', tip: '할인 요청', audio: 'en/en-bar-02.m4a' },
    { id: 'en-tur-08', category: '관광', meaning: '화장실이 어디예요?', original: 'Where is the comfort room?', pronunciation: '웨어 이즈 더 컴포트 룸?', tip: '화장실 문의', audio: 'en/en-tur-08.m4a' },
    { id: 'en-eme-01', category: '비상', meaning: '저 좀 도와주세요!', original: 'Please help me!', pronunciation: '플리즈 헬프 미!', tip: '긴급 지원 요청', audio: 'en/en-eme-01.m4a' },
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
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  // 펼쳐진 항목 ID (기본은 첫 번째 항목이 펼쳐짐)
  const [expandedId, setExpandedId] = useState<string | null>('0');

  const rawList = ESSENTIALS_DATA[country.id] || ESSENTIALS_DATA.en;

  const handleSpeak = (phrase: Phrase, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    unlockAudioPlayback();
    track('phrase_play', { id: phrase.id, category: phrase.category, lang: country.id });
    setPlayingId(phrase.id);
    playPhrase({
      phrase,
      country,
      rate: speed,
      onEnd: () => setPlayingId(null),
      onError: () => setPlayingId(null),
    });
  };

  const toggleExpand = (idxStr: string) => {
    setExpandedId(expandedId === idxStr ? null : idxStr);
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-2 border-amber-300/90 p-3.5 sm:p-4 rounded-3xl shadow-xs space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500 text-white rounded-2xl shadow-xs">
            <Star className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>{country.name} 초간단 10대 필수 표현</span>
              <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-bold">
                TOP 10
              </span>
            </h2>
            <p className="text-[11px] text-slate-600 font-medium">
              누르면 자세히 펼쳐집니다 (발음 듣기 & 전광판 지원)
            </p>
          </div>
        </div>
      </div>

      {/* 리스트 뷰: 한눈에 많이 보이고 누르면 자세히 펼쳐지는 아코디언 구조 */}
      <div className="space-y-2">
        {rawList.map((item, idx) => {
          const idxStr = String(idx);
          const isExpanded = expandedId === idxStr;
          const isPlaying = playingId === item.id;
          const bookmarked = isBookmarked(item.id);

          const phraseObj: Phrase = {
            id: item.id,
            countryId: country.id,
            category: item.category,
            original: item.original,
            translation: item.meaning,
            pronunciation: item.pronunciation,
            usageTip: item.tip,
            audio: item.audio,
            isEmergency: item.category === '비상',
          };

          return (
            <div
              key={`essential-${country.id}-${idx}`}
              className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-xs ${
                isExpanded
                  ? 'bg-white border-amber-400 shadow-md ring-2 ring-amber-400/20'
                  : 'bg-white/95 border-slate-200/90 hover:border-amber-300'
              }`}
            >
              {/* 요약 리스트 헤더 (항상 보임) */}
              <div
                onClick={() => toggleExpand(idxStr)}
                className="p-3 flex items-center justify-between gap-2.5 cursor-pointer select-none active:bg-slate-50"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 shadow-xs ${
                    isExpanded ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-sm font-black text-slate-900 tracking-tight">
                        {item.original}
                      </span>
                      <span className="text-[11px] text-rose-600 font-bold">
                        [{item.pronunciation}]
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-bold truncate">
                      {item.meaning}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* 빠른 발음 재생 */}
                  <button
                    onClick={(e) => handleSpeak(phraseObj, e)}
                    className={`p-2 rounded-xl transition-all active:scale-90 ${
                      isPlaying
                        ? 'bg-amber-400 text-slate-900 animate-pulse'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                    }`}
                    title="원어민 발음 듣기"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                  </button>

                  {/* 펼치기/접기 화살표 */}
                  <div className="p-1 text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-amber-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* 자세히 보기 (펼쳐진 상태) */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-amber-100 bg-amber-50/20 space-y-3 animate-in fade-in zoom-in-98 duration-150">
                  {/* 대형 원문 & 발음 */}
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug font-display">
                      {item.original}
                    </h3>
                    <p className="inline-block bg-amber-200/80 text-slate-900 px-2.5 py-1 rounded-xl text-xs sm:text-sm font-black">
                      [{item.pronunciation}]
                    </p>
                    <p className="text-sm font-extrabold text-slate-700 pt-1">
                      {item.meaning}
                    </p>
                    {item.tip && (
                      <p className="text-xs text-slate-600 font-medium bg-white p-2.5 rounded-xl border border-amber-200/80 flex items-start gap-1.5 mt-2">
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{item.tip}</span>
                      </p>
                    )}
                  </div>

                  {/* 액션 바: 발음 듣기 + 전광판 + 북마크 */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-amber-100 flex-wrap">
                    <button
                      onClick={() => handleSpeak(phraseObj)}
                      disabled={isPlaying}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-xs ${
                        isPlaying
                          ? 'bg-amber-400 text-slate-900 animate-pulse'
                          : 'bg-brand hover:bg-brand-hover text-white'
                      }`}
                    >
                      <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                      <span>{isPlaying ? '재생 중...' : '원어민 발음 듣기'}</span>
                    </button>

                    {/* 배속 */}
                    <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
                      {[0.8, 1.0, 1.2].map((s) => (
                        <button
                          key={s}
                          onClick={() => onSetSpeed(s)}
                          className={`px-2 py-1 rounded-lg transition-colors ${
                            speed === s
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>

                    {/* 3초 전광판 */}
                    <button
                      onClick={() => onOpenBillboard(phraseObj)}
                      className="p-2.5 bg-accent/20 text-alert hover:bg-accent/30 border border-accent/60 rounded-xl font-bold text-xs transition-all active:scale-95 shrink-0 flex items-center gap-1"
                      title="3초 전광판 크게 보기"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span className="text-[11px]">전광판</span>
                    </button>

                    {/* 북마크 */}
                    <button
                      onClick={() => onToggleBookmark(item.id)}
                      className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                        bookmarked
                          ? 'text-alert bg-accent/30'
                          : 'text-ink-mute hover:text-ink bg-white border border-slate-200'
                      }`}
                      title={bookmarked ? '저장 취소' : '저장하기'}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
