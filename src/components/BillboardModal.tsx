import { Modal } from './Modal';
import React, { useEffect, useRef, useState } from 'react';
import { Phrase, Country } from '../types';
import { playPhrase, stopAllPlayback, unlockAudioPlayback } from '../utils/speech';
import { track } from '../utils/analytics';
import { copyText } from '../utils/clipboard';
import { CURRENCIES, currencyForCountry, toKRW, formatNumber } from '../utils/currency';
import { soundEffects } from '../utils/soundEffects';
import {
  Volume2,
  X,
  ShieldAlert,
  Bus,
  Sun,
  Moon,
  Copy,
  Check,
  Calculator,
  MessageSquare,
} from 'lucide-react';

interface WakeLockSentinel {
  release: () => Promise<void>;
}

interface QuickReplyOption {
  id: string;
  emoji: string;
  ko: string;
  local: Record<string, string>;
}

const QUICK_REPLIES: QuickReplyOption[] = [
  {
    id: 'ok',
    emoji: '⭕',
    ko: '네, 가능해요 (OK)',
    local: { ph: 'Oo, pwede po', vn: 'Được ạ (OK)', en: 'Yes, OK!' },
  },
  {
    id: 'no',
    emoji: '❌',
    ko: '안 돼요 / 품절이에요',
    local: { ph: 'Hindi pwede / Wala po', vn: 'Không được / Hết rồi', en: 'No / Sold out' },
  },
  {
    id: 'wait',
    emoji: '⏳',
    ko: '잠시만 기다려 주세요',
    local: { ph: 'Sandali lang po', vn: 'Đợi một chút nhé', en: 'Wait a moment' },
  },
  {
    id: 'discount',
    emoji: '👌',
    ko: '깎아드릴게요 (할인 OK)',
    local: { ph: 'Sige, bawas presyo', vn: 'OK, giảm giá nhé', en: 'OK, discount!' },
  },
];

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
  const [showReplyPad, setShowReplyPad] = useState(false);
  const [selectedReply, setSelectedReply] = useState<QuickReplyOption | null>(null);
  const [priceInput, setPriceInput] = useState<string>('0');

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
      <header
        className="flex justify-between items-center w-full z-50 shrink-0 mb-2 gap-2"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <ShieldAlert className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 ${sunlightMode ? 'text-slate-950' : 'text-brand'}`} />
          <span className={`font-black text-sm sm:text-lg tracking-tight font-['Montserrat'] whitespace-nowrap truncate ${sunlightMode ? 'text-slate-950' : 'text-white'}`}>
            GIJO Tour{' '}
            <span
              className={`text-[11px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 border rounded hidden min-[370px]:inline-block ${
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

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 야외 햇빛 고대비 모드 토글 */}
          <button
            type="button"
            onClick={() => setSunlightMode(!sunlightMode)}
            aria-label={sunlightMode ? '어두운 모드로 전환' : '야외 햇빛 고대비 모드로 전환'}
            title={sunlightMode ? '다크 모드' : '야외 햇빛 고대비 모드'}
            className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full active:scale-95 transition-all border ${
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
            className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full active:scale-95 transition-all border ${
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
            className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full active:scale-95 transition-all border ${
              sunlightMode
                ? 'bg-black text-white hover:bg-slate-800 border-black'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      {/* Main Content Area — 터치 시 소리 재실행 */}
      <main
        onClick={handleReplay}
        className="flex-grow flex flex-col items-center justify-center relative my-auto text-center px-2 py-2 sm:py-4 cursor-pointer"
      >
        {/* Visual Pulse Animation Container */}
        {!sunlightMode && (
          <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
            <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-96 md:h-96 flex items-center justify-center">
              <div className="absolute w-full h-full rounded-full border-4 border-brand-vivid/30 animate-ping"></div>
              <div className="absolute w-3/4 h-3/4 rounded-full border-2 border-emerald-400/20 animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Local Instruction Badge */}
        <p
          className={`text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full border mb-3 ${
            sunlightMode
              ? 'bg-black text-white border-black'
              : 'text-[#8ef3f3] bg-[#112240] border-slate-700/80'
          }`}
        >
          LOCAL INSTRUCTION • {country.name} ({country.language})
        </p>

        {/* Huge Native Phrase Text */}
        <h1
          className={`text-3xl min-[380px]:text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-tight my-1.5 sm:my-2 font-['Montserrat'] max-w-full break-words ${
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

      {/* 🤝 전광판 2.0: 양방향 소통 & 현지인 가격 입력 패드 */}
      <div className="w-full max-w-lg mx-auto my-1.5 shrink-0">
        <button
          type="button"
          onClick={() => {
            soundEffects.playTap();
            setShowReplyPad((v) => !v);
          }}
          className={`w-full py-2.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 border transition-all active:scale-98 ${
            sunlightMode
              ? 'bg-black/90 text-amber-300 border-black'
              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-400/40'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>
            {showReplyPad
              ? '🤝 상대방 응답 · 가격 입력 패드 닫기 ▲'
              : '🤝 상대방(현지인) 응답 버튼 · 가격 입력 패드 열기 ▼'}
          </span>
        </button>

        {showReplyPad && (() => {
          const currCode = currencyForCountry(country.id);
          const currMeta = CURRENCIES[currCode];
          const numPrice = Number(priceInput) || 0;
          const krwPrice = toKRW(numPrice, currCode);
          const langKey = country.id === 'vn' ? 'vn' : country.id === 'ph' ? 'ph' : 'en';

          return (
            <div
              className={`mt-2 p-3.5 rounded-2xl border space-y-3 text-left ${
                sunlightMode
                  ? 'bg-white text-slate-950 border-black'
                  : 'bg-slate-900/95 text-white border-white/15'
              }`}
            >
              {/* 선택된 응답 배너 */}
              {selectedReply && (
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-between">
                  <span>
                    {selectedReply.emoji} 현지인 응답: {selectedReply.ko} (
                    {selectedReply.local[langKey]})
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedReply(null)}
                    className="text-xs underline ml-2"
                  >
                    지우기
                  </button>
                </div>
              )}

              {/* 1) 현지인이 누르는 원터치 의사소통 칩 */}
              <div>
                <p className="text-[11px] font-bold opacity-75 mb-1.5">
                  💬 현지인이 손가락으로 눌러 대답할 수 있습니다 (Touch to Reply):
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {QUICK_REPLIES.map((r) => {
                    const active = selectedReply?.id === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          soundEffects.playSuccess();
                          setSelectedReply(r);
                        }}
                        className={`p-2 rounded-xl border text-left transition-all active:scale-95 ${
                          active
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : sunlightMode
                            ? 'bg-slate-100 text-slate-900 border-slate-300'
                            : 'bg-white/10 text-white border-white/15 hover:bg-white/15'
                        }`}
                      >
                        <div className="text-xs font-black">
                          {r.emoji} {r.local[langKey]}
                        </div>
                        <div className="text-[11px] font-bold opacity-80">{r.ko}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2) 현지인 가격 직접 입력 패드 (즉시 원화 환산) */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold opacity-80 flex items-center gap-1">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>현지인 가격 입력 (Enter Price · {currCode})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setPriceInput('0')}
                    className="text-[11px] font-black text-rose-400 underline"
                  >
                    초기화(C)
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-black/50 border border-white/15 flex items-baseline justify-between gap-2 mb-2">
                  <div className="text-lg sm:text-xl font-black text-amber-300">
                    {currMeta.symbol} {formatNumber(numPrice)} {currCode}
                  </div>
                  <div className="text-base sm:text-lg font-black text-emerald-400">
                    ≈ {formatNumber(krwPrice)}원
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-1">
                  {['1', '2', '3', '4', '5', '0', '6', '7', '8', '9', '00', '000'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        soundEffects.playTap();
                        setPriceInput((prev) => {
                          const base = prev === '0' ? '' : prev;
                          const next = base + d;
                          return next.length > 9 ? prev : next || '0';
                        });
                      }}
                      className={`py-2 rounded-lg text-xs font-black border active:scale-95 ${
                        d === '000'
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : sunlightMode
                          ? 'bg-slate-200 text-slate-950 border-slate-400'
                          : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
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
