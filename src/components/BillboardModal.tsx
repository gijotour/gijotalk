import { Modal } from './Modal';
import React, { useEffect, useRef, useState } from 'react';
import { Phrase, Country } from '../types';
import { playPhrase, stopAllPlayback, unlockAudioPlayback } from '../utils/speech';
import { track } from '../utils/analytics';
import { copyText } from '../utils/clipboard';
import { Volume2, X, ShieldAlert, Bus, Sun, Moon, Copy, Check } from 'lucide-react';

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
  const [sunlightMode, setSunlightMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

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

  // 전광판을 보여주는 동안 화면이 꺼지지 않게 합니다.
  // 닫을 때 반드시 해제하며, 백그라운드 전환 후 복귀 시 자동 재획득합니다.
  useEffect(() => {
    const nav = navigator as unknown as {
      wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinel> };
    };
    if (!nav.wakeLock) return;

    let cancelled = false;

    const requestLock = async () => {
      if (cancelled || (typeof document !== 'undefined' && document.visibilityState !== 'visible')) return;
      try {
        const sentinel = await nav.wakeLock!.request('screen');
        if (cancelled) {
          sentinel.release().catch(() => {});
        } else {
          wakeLockRef.current = sentinel;
        }
      } catch {
        // 배터리 절약 모드 등에서의 요청 거부는 무시
      }
    };

    void requestLock();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void requestLock();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    };
  }, []);

  // 타이머 정리 및 닫을 때 음성 정지
  useEffect(() => {
    return () => {
      stopAllPlayback();
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleReplay = () => {
    if (isMutedByDesign) return;
    unlockAudioPlayback();
    playPhrase({ phrase, country, rate: 1.0 });
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 30, 100]);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${phrase.original} [${phrase.pronunciation || ''}] - ${phrase.translation}`;
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const panelBg = sunlightMode ? 'bg-[#FFEB3B] text-slate-950' : 'bg-[#020c1b] text-white';

  return (
    <Modal
      onClose={onClose}
      label={`긴급 전광판 — ${phrase.translation}`}
      variant="fullscreen"
      closeOnBackdrop={false}
      panelClassName={`w-full h-full ${panelBg} flex flex-col justify-between p-4 sm:p-6 overflow-y-auto select-none animate-in fade-in duration-200 transition-colors`}
    >
      {/* Top Header */}
      <header className="flex justify-between items-center w-full z-50 shrink-0 mb-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className={`w-6 h-6 shrink-0 ${sunlightMode ? 'text-slate-950' : 'text-brand'}`} />
          <span className={`font-black text-base sm:text-lg tracking-tight font-['Montserrat'] ${sunlightMode ? 'text-slate-950' : 'text-white'}`}>
            GIJO Tour{' '}
            <span
              className={`text-xs font-bold px-2 py-0.5 border rounded ${
                sunlightMode
                  ? 'bg-black text-white border-black'
                  : 'text-blue-400 bg-blue-950/60 border-blue-800'
              }`}
            >
              지아이조 투어
            </span>{' '}
            <span className={`text-xs font-normal hidden sm:inline ${sunlightMode ? 'text-slate-800' : 'text-ink-mute'}`}>
              | 3초 긴급 전광판
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* 야외 햇빛 고대비 모드 토글 */}
          <button
            type="button"
            onClick={() => setSunlightMode(!sunlightMode)}
            aria-label={sunlightMode ? '어두운 모드로 전환' : '야외 햇빛 고대비 모드로 전환'}
            title={sunlightMode ? '다크 모드' : '야외 햇빛 고대비 모드'}
            className={`w-11 h-11 flex items-center justify-center rounded-full active:scale-95 transition-all border ${
              sunlightMode
                ? 'bg-black text-amber-300 border-black'
                : 'bg-white/10 hover:bg-white/20 text-amber-300 border-white/20'
            }`}
          >
            {sunlightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* 복사 버튼 */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="문장 복사"
            title={copied ? '복사 완료!' : '문장 복사'}
            className={`w-11 h-11 flex items-center justify-center rounded-full active:scale-95 transition-all border ${
              sunlightMode
                ? 'bg-black/10 hover:bg-black/20 text-slate-950 border-black/20'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
          >
            {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
          </button>

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            aria-label="닫기"
            className={`w-11 h-11 flex items-center justify-center rounded-full active:scale-95 transition-all border ${
              sunlightMode
                ? 'bg-black text-white hover:bg-slate-800 border-black'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content Area — 터치 시 소리 재실행 */}
      <main
        onClick={handleReplay}
        className="flex-grow flex flex-col items-center justify-center relative my-auto text-center px-2 py-4 cursor-pointer"
      >
        {/* Visual Pulse Animation Container */}
        {!sunlightMode && (
          <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
            <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
              <div className="absolute w-full h-full rounded-full border-4 border-brand-vivid/30 animate-ping"></div>
              <div className="absolute w-3/4 h-3/4 rounded-full border-2 border-emerald-400/20 animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Local Instruction Badge */}
        <p
          className={`text-xs font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full border mb-4 ${
            sunlightMode
              ? 'bg-black text-white border-black'
              : 'text-[#8ef3f3] bg-[#112240] border-slate-700/80'
          }`}
        >
          LOCAL INSTRUCTION • {country.name} ({country.language})
        </p>

        {/* Huge Native Phrase Text */}
        <h1
          className={`text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-tight my-2 font-['Montserrat'] max-w-full break-words ${
            sunlightMode
              ? 'text-slate-950 drop-shadow-none'
              : 'text-white drop-shadow-[0_0_35px_rgba(255,107,74,0.6)]'
          }`}
        >
          {phrase.original}
        </h1>

        {/* Korean Translation & Pronunciation */}
        <div className="mt-3 space-y-1.5">
          <p
            className={`text-xl sm:text-3xl font-black ${
              sunlightMode ? 'text-slate-900' : 'text-brand'
            }`}
          >
            {phrase.translation}
          </p>
          {/* 일정표의 장소를 띄울 때는 발음 표기가 없습니다. "발음: " 만 뜨지 않게 감춥니다. */}
          {phrase.pronunciation && (
            <p
              className={`text-base sm:text-xl font-mono font-black ${
                sunlightMode ? 'text-rose-700' : 'text-emerald-400'
              }`}
            >
              [{phrase.pronunciation}]
            </p>
          )}
        </div>
      </main>

      {/* Usage Tip Badge */}
      <div
        className={`w-full max-w-lg mx-auto rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 border my-2 shrink-0 ${
          sunlightMode
            ? 'bg-white/80 text-slate-900 border-black/20'
            : 'bg-white/5 backdrop-blur-md text-white border-white/10'
        }`}
      >
        <div className={`p-2 rounded-xl shrink-0 ${sunlightMode ? 'bg-black text-white' : 'bg-brand text-white'}`}>
          <Bus className="w-5 h-5" />
        </div>
        <div className="flex-grow text-left min-w-0">
          <h3 className={`text-xs font-black mb-0.5 ${sunlightMode ? 'text-slate-950' : 'text-white'}`}>
            사용 팁
          </h3>
          <p className={`text-xs truncate sm:whitespace-normal ${sunlightMode ? 'text-slate-800 font-bold' : 'text-ink-mute'}`}>
            {phrase.usageTip || '화면을 터치하면 다시 큰 소리로 읽어줍니다. 운전기사나 현지인에게 보여주세요.'}
          </p>
        </div>
      </div>

      {/* Primary Action: Replay Loud Audio */}
      <footer className="w-full max-w-lg mx-auto pb-[calc(0.75rem+env(safe-area-inset-bottom))] shrink-0">
        {isMutedByDesign ? (
          <div
            className={`w-full border font-bold text-sm h-14 sm:h-16 rounded-full flex items-center justify-center gap-3 px-6 text-center ${
              sunlightMode
                ? 'bg-black/10 border-black text-slate-900'
                : 'bg-white/10 border-white/20 text-slate-200'
            }`}
          >
            이 표현은 뜻을 아는 용도입니다. 음성은 제공하지 않습니다.
          </div>
        ) : (
          <button
            onClick={handleReplay}
            className={`w-full font-black text-base sm:text-xl h-14 sm:h-20 rounded-full shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all ${
              sunlightMode
                ? 'bg-black text-amber-300 hover:bg-slate-900'
                : 'bg-white text-[#0a192f] hover:bg-slate-100'
            }`}
          >
            <Volume2 className={`w-6 h-6 sm:w-7 sm:h-7 ${sunlightMode ? 'text-amber-300' : 'text-brand'}`} />
            <span>큰 소리로 재생 (Loud Audio)</span>
          </button>
        )}
      </footer>
    </Modal>
  );
};
