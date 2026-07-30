import React, { useEffect } from 'react';
import { Phrase, Country } from '../types';
import { speakPhrase } from '../utils/audio';
import { Volume2, X, AlertTriangle, ShieldAlert, Bus } from 'lucide-react';

interface BillboardModalProps {
  phrase: Phrase;
  country: Country;
  onClose: () => void;
}

export const BillboardModal: React.FC<BillboardModalProps> = ({
  phrase,
  country,
  onClose,
}) => {
  // Auto-speak on launch for quick 3-second response!
  useEffect(() => {
    speakPhrase({
      text: phrase.original,
      langCode: country.langCode,
      rate: 1.0,
      volume: 1.0,
      voiceGender: 'female',
    });

    // Request wake lock if supported
    if ('wakeLock' in navigator) {
      (navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } }).wakeLock
        .request('screen')
        .catch(() => {});
    }
  }, [phrase, country]);

  const handleReplay = () => {
    speakPhrase({
      text: phrase.original,
      langCode: country.langCode,
      rate: 1.0,
      volume: 1.0,
      voiceGender: 'female',
    });

    if ('vibrate' in navigator) {
      navigator.vibrate([100, 30, 100]);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#020c1b] text-white flex flex-col justify-between p-6 overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header */}
      <header className="flex justify-between items-center w-full z-50">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[#FF6B4A]" />
          <span className="font-black text-lg tracking-tight font-['Montserrat'] text-white">
            GIJO Talk <span className="text-xs font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 border border-blue-800 rounded">GIJO LABS</span> <span className="text-xs font-normal text-slate-400">| 3초 긴급 전광판</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full active:scale-95 transition-all border border-white/10"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center relative my-auto text-center px-2">
        {/* Visual Pulse Animation Container */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
          <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
            <div className="absolute w-full h-full rounded-full border-4 border-[#FF6B4A]/30 animate-ping"></div>
            <div className="absolute w-3/4 h-3/4 rounded-full border-2 border-emerald-400/20 animate-pulse"></div>
          </div>
        </div>

        {/* Local Instruction Badge */}
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8ef3f3] bg-[#112240] px-4 py-1.5 rounded-full border border-slate-700/80 mb-6">
          LOCAL INSTRUCTION • {country.name} ({country.language})
        </p>

        {/* Huge Native Phrase Text */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight drop-shadow-[0_0_35px_rgba(255,107,74,0.6)] leading-none my-2 font-['Montserrat']">
          {phrase.original}
        </h1>

        {/* Korean Translation & Pronunciation */}
        <div className="mt-4 space-y-2">
          <p className="text-2xl sm:text-3xl font-extrabold text-[#FF6B4A]">
            {phrase.translation}
          </p>
          <p className="text-base sm:text-lg font-mono text-emerald-400 font-bold">
            발음: {phrase.pronunciation}
          </p>
        </div>
      </main>

      {/* Usage Tip Badge */}
      <div className="w-full max-w-lg mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/10 my-4">
        <div className="bg-[#FF6B4A] p-2.5 rounded-xl text-white">
          <Bus className="w-5 h-5" />
        </div>
        <div className="flex-grow text-left">
          <h3 className="text-xs font-bold text-white mb-0.5">사용 팁</h3>
          <p className="text-xs text-slate-300">{phrase.usageTip || '이 화면을 운전기사나 현지인에게 보여주세요.'}</p>
        </div>
      </div>

      {/* Primary Action: Replay Loud Audio */}
      <footer className="w-full max-w-lg mx-auto pb-4">
        <button
          onClick={handleReplay}
          className="w-full bg-white text-[#0a192f] font-extrabold text-lg sm:text-xl h-16 sm:h-20 rounded-full shadow-2xl flex items-center justify-center gap-3 hover:bg-slate-100 active:scale-95 transition-all"
        >
          <Volume2 className="w-7 h-7 text-[#FF6B4A]" />
          <span>큰 소리로 재생 (Loud Audio)</span>
        </button>
      </footer>
    </div>
  );
};
