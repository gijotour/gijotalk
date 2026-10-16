import React, { useState, useEffect } from 'react';
import { Country } from '../types';
import { Modal } from './Modal';
import {
  CURRENCIES,
  CurrencyCode,
  currencyForCountry,
  getRateToKRW,
  saveCustomRate,
  resetCustomRate,
  toKRW,
  splitAmount,
  formatNumber,
  TIP_GUIDES,
} from '../utils/currency';
import { soundEffects } from '../utils/soundEffects';
import {
  Calculator,
  X,
  Users,
  Sparkles,
  RotateCcw,
  Delete,
  Minus,
  Plus,
  Check,
  Coins,
} from 'lucide-react';

interface TravelCalculatorModalProps {
  isOpen: boolean;
  country: Country;
  onClose: () => void;
}

export const TravelCalculatorModal: React.FC<TravelCalculatorModalProps> = ({
  isOpen,
  country,
  onClose,
}) => {
  const [currency, setCurrency] = useState<CurrencyCode>(() => currencyForCountry(country.id));
  const [amountStr, setAmountStr] = useState<string>('0');
  const [people, setPeople] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'calc' | 'tips'>('calc');
  const [editingRate, setEditingRate] = useState<boolean>(false);
  const [rateInput, setRateInput] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const nextCurr = currencyForCountry(country.id);
      setCurrency(nextCurr);
      setAmountStr(nextCurr === 'VND' ? '100000' : nextCurr === 'PHP' ? '500' : '10');
      setPeople(1);
      setEditingRate(false);
    }
  }, [isOpen, country.id]);

  if (!isOpen) return null;

  const meta = CURRENCIES[currency];
  const currentRate = getRateToKRW(currency);
  const numericAmount = Number(amountStr.replace(/[^0-9.]/g, '')) || 0;
  const krwTotal = toKRW(numericAmount, currency, currentRate);
  const split = splitAmount(numericAmount, people, currency, currentRate);

  const handleDigit = (digit: string) => {
    soundEffects.playTap();
    setAmountStr((prev) => {
      const clean = prev === '0' ? '' : prev;
      const next = clean + digit;
      if (next.length > 10) return prev;
      return next || '0';
    });
  };

  const handleQuickAdd = (val: number) => {
    soundEffects.playTap();
    setAmountStr((prev) => {
      const current = Number(prev) || 0;
      const next = current + val;
      return String(Math.min(next, 999_999_999));
    });
  };

  const handleBackspace = () => {
    soundEffects.playTap();
    setAmountStr((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
  };

  const handleClear = () => {
    soundEffects.playTap();
    setAmountStr('0');
  };

  const handleSaveRate = () => {
    const val = parseFloat(rateInput);
    if (Number.isFinite(val) && val > 0) {
      const actualRate = val / meta.displayUnit;
      saveCustomRate(currency, actualRate);
    }
    setEditingRate(false);
  };

  const tipCountry: 'ph' | 'vn' = country.id === 'vn' || currency === 'VND' ? 'vn' : 'ph';
  const tips = TIP_GUIDES[tipCountry];

  return (
    <Modal
      onClose={onClose}
      label="1초 환율 및 팁·더치페이 계산기"
      variant="center"
      panelClassName="bg-white border-2 border-emerald-200 rounded-3xl p-4 sm:p-5 w-full max-w-md shadow-2xl text-slate-900 relative max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-600 text-white rounded-2xl shadow-xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
              <span>1초 환율 &amp; 팁 계산기</span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-extrabold">
                OFFLINE
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 font-bold">
              흥정·마사지·골프 캐디팁·1/N 정산
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="계산기 닫기"
          className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 상단 모드 탭: 환율/더치페이 vs 현지 팁 가이드 */}
      <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 mb-3">
        <button
          type="button"
          onClick={() => setActiveTab('calc')}
          className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'calc'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>환율 · 1/N 더치페이</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tips')}
          className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'tips'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>골프 · 마사지 팁 기준</span>
        </button>
      </div>

      {activeTab === 'calc' ? (
        <div className="space-y-3">
          {/* 통화 선택 탭 */}
          <div className="grid grid-cols-3 gap-1.5">
            {(['PHP', 'VND', 'USD'] as CurrencyCode[]).map((c) => {
              const item = CURRENCIES[c];
              const active = currency === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    soundEffects.playTap();
                    setCurrency(c);
                    setAmountStr(c === 'VND' ? '100000' : c === 'PHP' ? '500' : '10');
                    setEditingRate(false);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-black border-2 transition-all flex items-center justify-center gap-1 ${
                    active
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.flag}</span>
                  <span>{item.code}</span>
                </button>
              );
            })}
          </div>

          {/* 금액 디스플레이 박스 */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>
                {meta.flag} {meta.name} ({meta.code})
              </span>
              {!editingRate ? (
                <button
                  type="button"
                  onClick={() => {
                    setRateInput(String(Math.round(currentRate * meta.displayUnit * 100) / 100));
                    setEditingRate(true);
                  }}
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>
                    기준: {meta.displayUnit} {meta.code} ={' '}
                    {Math.round(currentRate * meta.displayUnit * 100) / 100}원
                  </span>
                  <span className="underline">(수정)</span>
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-[11px]">{meta.displayUnit}{meta.code}=</span>
                  <input
                    type="number"
                    step="0.1"
                    value={rateInput}
                    onChange={(e) => setRateInput(e.target.value)}
                    aria-label="사용자 환율 입력"
                    className="w-16 px-1.5 py-0.5 rounded bg-slate-800 border border-emerald-400 text-white text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleSaveRate}
                    className="p-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetCustomRate(currency);
                      setEditingRate(false);
                    }}
                    title="기본 환율 복원"
                    className="p-1 bg-slate-700 text-slate-200 rounded text-[10px]"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-baseline justify-between gap-2 pt-1">
              <span className="text-xs text-slate-400 font-bold">현지 금액</span>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-300 truncate">
                {meta.symbol} {formatNumber(numericAmount)}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-2 flex items-baseline justify-between gap-2">
              <span className="text-xs text-emerald-400 font-extrabold">🇰🇷 한국 돈 환산</span>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                약 {formatNumber(krwTotal)}원
              </div>
            </div>
          </div>

          {/* 빠른 금액 단축 칩 (베트남 동 10k/50k/100k 등) */}
          <div className="flex flex-wrap gap-1.5">
            {meta.quickAmounts.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => handleQuickAdd(q.value)}
                className="flex-1 min-w-[68px] py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-black active:scale-95 transition-all"
              >
                {q.label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black active:scale-95 transition-all"
            >
              초기화
            </button>
          </div>

          {/* 숫자 키패드 */}
          <div className="grid grid-cols-4 gap-1.5">
            {['1', '2', '3', 'C', '4', '5', '6', '⌫', '7', '8', '9', '00', '0', '000'].map((key) => {
              if (key === 'C') {
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={handleClear}
                    className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-sm font-black active:scale-95"
                  >
                    C
                  </button>
                );
              }
              if (key === '⌫') {
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={handleBackspace}
                    aria-label="한 글자 지우기"
                    className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-sm font-black flex items-center justify-center active:scale-95"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                );
              }
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleDigit(key)}
                  className={`${
                    key === '000' ? 'col-span-2 bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-900'
                  } py-2.5 hover:bg-slate-100 border rounded-xl text-sm font-black active:scale-95 transition-all`}
                >
                  {key}
                </button>
              );
            })}
          </div>

          {/* 👥 1/N 더치페이 정산 바 */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-black text-slate-800">1/N 더치페이 정산</div>
                <div className="text-[11px] text-slate-500 font-bold">
                  1인당 {formatNumber(split.perPersonLocal)} {meta.code} (약{' '}
                  <span className="text-emerald-700 font-black">
                    {formatNumber(split.perPersonKRW)}원
                  </span>
                  )
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                aria-label="인원 감소"
                onClick={() => setPeople((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-xs font-black text-slate-900">{people}명</span>
              <button
                type="button"
                aria-label="인원 증가"
                onClick={() => setPeople((p) => Math.min(20, p + 1))}
                className="w-8 h-8 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 골프 · 마사지 · 호텔 표준 팁 가이드 탭 */
        <div className="space-y-2.5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 font-bold">
            💡 항목의 <b>[계산기에 넣기]</b>를 누르면 원화 환산 금액과 인원별 정산을 바로 확인할 수 있습니다.
          </div>

          {tips.map((tip) => (
            <div
              key={tip.id}
              className="p-3.5 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900">{tip.title}</div>
                <div className="text-sm font-black text-emerald-700 mt-0.5">
                  {tip.amountText}{' '}
                  <span className="text-xs text-slate-500 font-bold">
                    (약 {formatNumber(toKRW(tip.amountValue, tip.currency))}원)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{tip.note}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playTap();
                  setCurrency(tip.currency);
                  setAmountStr(String(tip.amountValue));
                  setActiveTab('calc');
                }}
                className="shrink-0 px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black active:scale-95 transition-all"
              >
                계산기에 넣기
              </button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};
