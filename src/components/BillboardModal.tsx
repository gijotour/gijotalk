import { Modal } from './Modal';
import React, { useEffect, useRef } from 'react';
import { Phrase, Country } from '../types';
import { playPhrase, stopAllPlayback, unlockAudioPlayback } from '../utils/speech';
import { track } from '../utils/analytics';
import { Volume2, X, ShieldAlert, Bus } from 'lucide-react';

interface WakeLockSentinel {
  release: () => Promise<void>;
}

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
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // 🔴 강한 욕설은 자동 재생하지 않습니다. 전광판은 열자마자 소리가 나기 때문에
  // 공공장소에서 사고가 날 수 있습니다. 화면으로만 보여줍니다.
  const isMutedByDesign = phrase.toneGuide?.startsWith('🔴') ?? false;

  // 3초 안에 보여주고 들려주는 게 목적이라 열자마자 자동 재생합니다.
  useEffect(() => {
    track('billboard_open', { id: phrase.id, category: phrase.category, lang: country.id });
    if (isMutedByDesign) return;
    unlockAudioPlayback();
    playPhrase({ phrase, country, rate: 1.0 });
  }, [phrase, country, isMutedByDesign]);

  // 전광판을 보여주는 동안만 화면이 꺼지지 않게 합니다.
  // 닫을 때 반드시 해제해야 이후 내내 화면이 켜져 배터리가 새지 않습니다.
  useEffect(() => {
    const nav = navigator as unknown as {
      wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinel> };
    };
    if (!nav.wakeLock) return;

    let cancelled = false;
    nav.wakeLock
      .request('screen')
      .then((sentinel) => {
        if (cancelled) sentinel.release().catch(() => {});
        else wakeLockRef.current = sentinel;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    };
  }, []);

  // 닫으면 음성도 멈춰야 합니다.
  useEffect(() => () => stopAllPlayback(), []);

  const handleReplay = () => {
    unlockAudioPlayback();
    playPhrase({ phrase, country, rate: 1.0 });
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 30, 100]);
    }
  };

  return (
    <Modal
      onClose={onClose}
      label={`긴급 전광판 — ${phrase.translation}`}
      variant="fullscreen"
      closeOnBackdrop={false}
      panelClassName="w-full h-full bg-[#020c1b] text-white flex flex-col justify-between p-6 overflow-hidden select-none animate-in fade-in duration-200"
    >
      {/* Top Header */}
      <header className="flex justify-between items-center w-full z-50">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-brand" />
          <span className="font-black text-lg tracking-tight font-['Montserrat'] text-white">
            Gijo talk(PH) <span className="text-xs font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 border border-blue-800 rounded">GIJO LABS</span> <span className="text-xs font-normal text-ink-mute">| 3초 긴급 전광판</span>
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
            <div className="absolute w-full h-full rounded-full border-4 border-brand-vivid/30 animate-ping"></div>
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
          <p className="text-2xl sm:text-3xl font-extrabold text-brand">
            {phrase.translation}
          </p>
          {/* 일정표의 장소를 띄울 때는 발음 표기가 없습니다. "발음: " 만 뜨지 않게 감춥니다. */}
          {phrase.pronunciation && (
            <p className="text-base sm:text-lg font-mono text-emerald-400 font-bold">
              발음: {phrase.pronunciation}
            </p>
          )}
        </div>
      </main>

      {/* Usage Tip Badge */}
      <div className="w-full max-w-lg mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/10 my-4">
        <div className="bg-brand p-2.5 rounded-xl text-white">
          <Bus className="w-5 h-5" />
        </div>
        <div className="flex-grow text-left">
          <h3 className="text-xs font-bold text-white mb-0.5">사용 팁</h3>
          <p className="text-xs text-ink-mute">{phrase.usageTip || '이 화면을 운전기사나 현지인에게 보여주세요.'}</p>
        </div>
      </div>

      {/* Primary Action: Replay Loud Audio */}
      <footer className="w-full max-w-lg mx-auto pb-[calc(1rem+env(safe-area-inset-bottom))]">
        {isMutedByDesign ? (
          <div className="w-full bg-white/10 border border-white/20 text-slate-200 font-bold text-sm h-16 rounded-full flex items-center justify-center gap-3 px-6 text-center">
            이 표현은 뜻을 아는 용도입니다. 음성은 제공하지 않습니다.
          </div>
        ) : (
          <button
            onClick={handleReplay}
            className="w-full bg-white text-[#0a192f] font-extrabold text-lg sm:text-xl h-16 sm:h-20 rounded-full shadow-2xl flex items-center justify-center gap-3 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <Volume2 className="w-7 h-7 text-brand" />
            <span>큰 소리로 재생 (Loud Audio)</span>
          </button>
        )}
      </footer>
    </Modal>
  );
};
