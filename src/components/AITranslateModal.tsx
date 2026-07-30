import React, { useState } from 'react';
import { Country, Phrase } from '../types';
import { speakPhrase } from '../utils/audio';
import { Sparkles, Send, Volume2, X, AlertCircle, Maximize2, Loader2 } from 'lucide-react';

interface AITranslateModalProps {
  country: Country;
  onClose: () => void;
  onOpenBillboard: (phrase: Phrase) => void;
  onAddCustomPhrase?: (phrase: Phrase) => void;
}

const SAMPLE_PROMPTS = [
  '고수(라우무이/팍치) 들어갔는지 물어보기',
  '배탈/두통이 나서 약국에서 추천받기',
  '미터기 안 켜는 바가지 택시 거절하기',
  '얼음 빼고 과일주스 부탁하기',
  '호텔 체크인 전 짐 맡겨달라고 요청하기',
];

export const AITranslateModal: React.FC<AITranslateModalProps> = ({
  country,
  onClose,
  onOpenBillboard,
  onAddCustomPhrase,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPhrase, setGeneratedPhrase] = useState<Phrase | null>(null);

  const handleTranslate = async (customPrompt?: string) => {
    const textToSubmit = customPrompt || prompt;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryName: country.name,
          language: country.language,
          promptText: textToSubmit,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'AI 번역에 실패했습니다.');
      }

      const validCategories = ['항공', '호텔', '교통', '식당', '흥정', '미팅/사교', '비상'];
      const rawCategory = data.phrase.category || '비상';
      const phraseCategory = validCategories.includes(rawCategory) ? rawCategory : '비상';

      const p: Phrase = {
        id: `ai-${Date.now()}`,
        countryId: country.id,
        category: phraseCategory as any,
        original: data.phrase.original,
        translation: data.phrase.translation,
        pronunciation: data.phrase.pronunciation,
        toneGuide: data.phrase.toneGuide,
        usageTip: data.phrase.usageTip,
        isEmergency: data.phrase.isEmergency,
      };

      setGeneratedPhrase(p);
      if (onAddCustomPhrase) {
        onAddCustomPhrase(p);
      }

      // Speak generated phrase
      speakPhrase({
        text: p.original,
        langCode: country.langCode,
        rate: 1.0,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-orange-100 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-orange-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#FF6B4A] rounded-2xl text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">AI 맞춤 현지 회화</h3>
              <p className="text-xs text-slate-500 font-bold">
                GIJO LABS AI · {country.flag} {country.name} ({country.language})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-full bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Input */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
              placeholder="예: 얼음 빼고 과일주스 만들어 주세요"
              className="w-full bg-[#FDFBF7] border-2 border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF6B4A] pr-12 font-bold"
            />
            <button
              onClick={() => handleTranslate()}
              disabled={loading || !prompt.trim()}
              className="absolute right-2 top-2.5 p-2 bg-[#FF6B4A] hover:bg-[#ff5a36] disabled:opacity-50 text-white rounded-xl transition-all shadow-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
              자주 묻는 질문 팁
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(sp);
                    handleTranslate(sp);
                  }}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-xs text-slate-700 font-bold transition-colors text-left"
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Container */}
        {generatedPhrase && !loading && (
          <div className="mt-6 p-5 bg-[#FDFBF7] border-2 border-[#FF6B4A] rounded-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 bg-orange-100 text-[#FF6B4A] text-[10px] font-black rounded-md uppercase">
                  AI 생성 표현
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5 italic font-['Montserrat']">
                  {generatedPhrase.original}
                </h4>
                <p className="text-lg font-bold text-slate-700">
                  {generatedPhrase.translation}
                </p>
              </div>
              <button
                onClick={() => onOpenBillboard(generatedPhrase)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-[#D97706] hover:bg-orange-50 shadow-xs"
                title="3초 긴급 전광판 확대"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-black text-[#D97706] bg-[#FFB800]/20 p-2 rounded-lg border border-[#FFB800]/50">
              발음: {generatedPhrase.pronunciation}
            </p>

            {generatedPhrase.usageTip && (
              <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border-l-4 border-[#FF6B4A] font-medium shadow-xs">
                💡 {generatedPhrase.usageTip}
              </p>
            )}

            <button
              onClick={() =>
                speakPhrase({
                  text: generatedPhrase.original,
                  langCode: country.langCode,
                })
              }
              className="w-full py-3 bg-[#FF6B4A] hover:bg-[#ff5a36] text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#FF6B4A]/20"
            >
              <Volume2 className="w-4 h-4" />
              <span>큰 소리로 들려주기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
