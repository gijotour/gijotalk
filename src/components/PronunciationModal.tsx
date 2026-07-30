import { Modal } from './Modal';
import React, { useState, useEffect } from 'react';
import { Phrase, Country } from '../types';
import { startPronunciationCheck } from '../utils/audio';
import { playPhrase, unlockAudioPlayback } from '../utils/speech';
import { Mic, Volume2, X, RotateCcw, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface PronunciationModalProps {
  phrase: Phrase;
  country: Country;
  onClose: () => void;
}

export const PronunciationModal: React.FC<PronunciationModalProps> = ({
  phrase,
  country,
  onClose,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isMatched, setIsMatched] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startListening = () => {
    setIsListening(true);
    setTranscript(null);
    setScore(null);
    setIsMatched(null);
    setError(null);

    startPronunciationCheck({
      langCode: country.langCode,
      targetText: phrase.original,
      onResult: (spokenText, accuracy, matched) => {
        setIsListening(false);
        setTranscript(spokenText);
        setScore(accuracy);
        setIsMatched(matched);
      },
      onError: (errMsg) => {
        setIsListening(false);
        setError(errMsg);
      },
    });
  };

  useEffect(() => {
    startListening();
  }, [phrase, country]);

  return (
    <Modal onClose={onClose} label="실전 발음 체크">
      <div className="bg-white border-2 border-orange-100 rounded-3xl max-w-md w-full p-6 text-slate-900 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-center">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-orange-100 mb-4">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-brand" />
            <h3 className="font-extrabold text-sm text-slate-900">실전 발음 체크 (STT)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ink-mute hover:text-slate-900 rounded-full bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phrase Info */}
        <div className="bg-canvas p-4 rounded-2xl border-2 border-slate-100 mb-6 shadow-xs">
          <p className="text-brand font-black text-xl italic font-['Montserrat']">
            {phrase.original}
          </p>
          <p className="text-xs font-bold text-slate-800 mt-0.5">{phrase.translation}</p>
          <p className="text-xs font-bold text-alert mt-1">발음: {phrase.pronunciation}</p>
        </div>

        {/* Recording Visualizer State */}
        <div className="my-6 flex flex-col items-center justify-center min-h-32">
          {isListening ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-brand-vivid/20 animate-ping absolute"></div>
                <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center text-white shadow-md shadow-brand-vivid/40 z-10">
                  <Mic className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <p className="text-xs font-bold text-brand animate-pulse">
                듣고 있습니다... 크게 발음해보세요!
              </p>
            </div>
          ) : score !== null ? (
            <div className="space-y-3 w-full animate-in fade-in duration-200">
              <div className="flex items-center justify-center gap-2 text-2xl font-black">
                <span className={score >= 60 ? 'text-emerald-600' : 'text-alert'}>
                  {score}점
                </span>
                {score >= 60 ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                ) : (
                  <Sparkles className="w-8 h-8 text-accent" />
                )}
              </div>

              <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-200 text-xs text-slate-700">
                <span className="text-ink-mute block text-xs font-bold">인식된 음성:</span>
                <span className="font-bold text-slate-900">"{transcript}"</span>
              </div>

              <p className="text-xs font-bold text-slate-700">
                {score >= 80
                  ? '🎉 완벽해요! 현지인이 즉시 알아들을 수 있습니다.'
                  : score >= 60
                  ? '👍 잘했어요! 현지에서 통하는 충분한 발음입니다.'
                  : '💡 원어민 음성을 한 번 더 듣고 다시 도전해 보세요.'}
              </p>
            </div>
          ) : error ? (
            <div className="p-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          ) : null}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              unlockAudioPlayback();
              playPhrase({ phrase, country });
            }}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
          >
            <Volume2 className="w-4 h-4 text-brand" />
            <span>원어민 듣기</span>
          </button>

          <button
            onClick={startListening}
            disabled={isListening}
            className="flex-1 py-3 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-vivid/20 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 측정하기</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
