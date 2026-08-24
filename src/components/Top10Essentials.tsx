import React, { useState } from 'react';
import { Country, Phrase } from '../types';
import { Volume2, Maximize2, Bookmark, Star, Sparkles } from 'lucide-react';
import { playPhrase, unlockAudioPlayback, hasRecordedAudio } from '../utils/speech';
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

// 각 국가별 정식 오디오 파일이 100% 매핑된 10대 기본 표현 ID 및 텍스트 정의
const VERIFIED_TOP_10_IDS: Record<string, string[]> = {
  ph: [
    'ph-soc-01', // 안녕하세요 (Kumusta po kayo?)
    'ph-soc-03', // 감사합니다 (Salamat po!)
    'ph-soc-04', // 죄송합니다 (Pasensya na po...)
    'ph-02',     // 얼마인가요? (Magkano po ito?)
    'ph-05',     // 깎아주세요 (Masyadong mahal, bawas naman!)
    'ph-tur-08', // 화장실 어디예요? (Nasaan po ang CR?)
    'ph-09',     // 도와주세요! (Tulong! Paki-ingat!)
    'ph-soc-18', // 아니요, 괜찮습니다 (Hindi po ako interesado. Salamat.)
    'ph-tra-02', // 요금이 얼마인가요? (Magkano po ang pamasahe?)
    'ph-soc-15', // 잘 가요, 또 만나요! (Magkita tayo ulit!)
  ],
  vn: [
    'vn-soc-01', // 안녕하세요 (Chào anh/chị!)
    'vn-12',     // 감사합니다 (Cảm ơn nhiều!)
    'vn-soc-04', // 죄송합니다 (Xin lỗi...)
    'vn-soc-15', // 네, 반갑습니다 (Vâng, rất vui được gặp anh/chị.)
    'vn-soc-12', // 아니요, 괜찮습니다 (Tôi không quan tâm. Cảm ơn.)
    'vn-02',     // 얼마예요? (Bao nhiêu tiền?)
    'vn-03',     // 깎아주세요 (Đắt quá, giảm giá đi!)
    'vn-08',     // 화장실 어디예요? (Nhà vệ sinh ở đâu?)
    'vn-09',     // 도와주세요! (Cứu tôi với!)
    'vn-18',     // 잘 가요, 또 만나요! (Hẹn gặp lại nhé!)
  ],
  en: [
    'en-soc-04', // 안녕하세요 (Hi! How are you doing today?)
    'en-soc-01', // 감사합니다 (Thank you so much.)
    'en-bar-05', // 그냥 구경만 할게요, 감사합니다 (I'm just looking, thank you.)
    'en-soc-18', // 아니요, 괜찮습니다 (No, thank you. I'm not interested.)
    'en-bar-01', // 이거 얼마인가요? (How much is this?)
    'en-bar-02', // 좀 깎아주실 수 있나요? (Can you give me a discount?)
    'en-tur-08', // 화장실 어디예요? (Where is the comfort room?)
    'en-eme-01', // 도와주세요! (Please help me!)
    'en-tra-03', // 요금이 얼마인가요? (How much is the fare?)
    'en-soc-08', // 영어 정말 잘하시네요! (Your English is really good!)
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

  // 국가별 정식 오디오가 존재하는 10대 기본 표현 필터링
  const top10Phrases = React.useMemo(() => {
    const targetIds = VERIFIED_TOP_10_IDS[country.id] || VERIFIED_TOP_10_IDS.en;
    const matchedList: Phrase[] = [];

    targetIds.forEach((id) => {
      const found = phrases.find((p) => p.id === id);
      if (found) matchedList.push(found);
    });

    // 부족한 경우 앞쪽 문장들로 채움
    if (matchedList.length < 10) {
      phrases.forEach((p) => {
        if (matchedList.length < 10 && !matchedList.some((m) => m.id === p.id)) {
          matchedList.push(p);
        }
      });
    }

    return matchedList.slice(0, 10);
  }, [country.id, phrases]);

  const handleSpeak = (phrase: Phrase) => {
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

  if (top10Phrases.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-2 border-amber-300/80 p-4 sm:p-5 rounded-3xl shadow-xs space-y-3.5">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500 text-white rounded-2xl shadow-xs">
            <Star className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>{country.name} 여행 10대 기본 필수 표현</span>
              <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-bold">
                초기본 10
              </span>
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              공항·택시·식당에서 가장 많이 쓰는 1초 생존 표현 (원어민 음성 100% 탑재)
            </p>
          </div>
        </div>
      </div>

      {/* PhraseCard 와 동일한 프리미엄 템플릿 그리드 */}
      <div className="grid grid-cols-1 gap-3">
        {top10Phrases.map((phrase, idx) => {
          const isPlaying = playingId === phrase.id;
          const bookmarked = isBookmarked(phrase.id);
          const hasAudio = hasRecordedAudio(phrase.id);

          return (
            <div
              key={`top10-${phrase.id}`}
              className="bg-white p-4 rounded-2xl border-2 border-amber-200/90 hover:border-brand-vivid shadow-xs relative overflow-hidden group transition-all duration-200"
            >
              {/* 상단 메타 바 */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="px-2.5 py-0.5 bg-orange-100 text-brand rounded-xl text-xs font-bold uppercase tracking-wider">
                    {phrase.category}
                  </span>
                  {phrase.toneGuide && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-xl font-bold">
                      {phrase.toneGuide}
                    </span>
                  )}
                  {phrase.isEmergency && (
                    <span className="px-2.5 py-0.5 bg-accent/20 text-alert rounded-xl text-xs font-bold tracking-wide border border-accent/50">
                      🚨 긴급
                    </span>
                  )}
                </div>

                {/* 액션 버튼: 전광판 & 북마크 */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenBillboard(phrase)}
                    className="p-1.5 text-ink-mute hover:text-brand hover:bg-orange-50 rounded-xl transition-colors"
                    title="전광판 크게 보기"
                  >
                    <Maximize2 className="w-4 h-4 text-alert" />
                  </button>

                  <button
                    onClick={() => onToggleBookmark(phrase.id)}
                    className={`p-1.5 rounded-xl transition-colors ${
                      bookmarked
                        ? 'text-alert bg-accent/30'
                        : 'text-ink-mute hover:text-ink hover:bg-slate-100'
                    }`}
                    aria-pressed={bookmarked}
                    title={bookmarked ? '저장 취소' : '저장하기'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* 본문: 원문 & 발음 & 번역 */}
              <div className="space-y-1 my-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                  {phrase.original}
                </h3>
                <p className="text-xs font-extrabold text-alert">
                  [{phrase.pronunciation}]
                </p>
                <p className="text-xs text-slate-600 font-bold pt-0.5">
                  {phrase.translation}
                </p>
                {phrase.usageTip && (
                  <p className="text-[11px] text-slate-500 font-medium bg-slate-50 p-2 rounded-xl border border-slate-100 mt-1.5">
                    💡 {phrase.usageTip}
                  </p>
                )}
              </div>

              {/* 하단 재생 컨트롤 바 */}
              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
                <button
                  onClick={() => handleSpeak(phrase)}
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

                {/* 배속 선택 */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
                  {[0.8, 1.0, 1.2].map((s) => (
                    <button
                      key={s}
                      onClick={() => onSetSpeed(s)}
                      className={`px-2 py-1 rounded-lg transition-colors ${
                        speed === s
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
