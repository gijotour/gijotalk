import React, { useState, useEffect, useRef } from 'react';
import { Country } from '../types';
import { COUNTRIES, IS_SINGLE_COUNTRY, IS_STATIC_BUILD } from '../config';
import {
  Globe,
  ChevronDown,
  Sparkles,
  Gamepad2,
  FileText,
  Calculator,
  SlidersHorizontal,
  CheckSquare,
} from 'lucide-react';

interface HeaderProps {
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
  onOpenAIAssistant: () => void;
  onOpenGameHub?: () => void;
  onOpenEmergencyModal?: () => void;
  onOpenPartyGame?: () => void;
  onOpenArcade?: () => void;
  onOpenEntryGuide: () => void;
  onOpenCalculator?: () => void;
  onOpenChecklist?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCountry,
  onSelectCountry,
  onOpenAIAssistant,
  onOpenGameHub,
  onOpenPartyGame,
  onOpenEntryGuide,
  onOpenCalculator,
  onOpenChecklist,
}) => {
  const [openMenu, setOpenMenu] = useState<'country' | 'tools' | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  // 바깥 클릭 또는 ESC 시 열린 메뉴 닫기
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openMenu]);

  return (
    <header
      className="sticky top-0 z-50 bg-canvas/95 backdrop-blur-md px-3 sm:px-6 pb-2.5 flex items-center justify-between gap-2 border-b border-slate-200/80"
      style={{ paddingTop: 'calc(0.625rem + env(safe-area-inset-top))' }}
    >
      {/* 심플 브랜드 워드마크 */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-7 h-7 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
          <Globe className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-black tracking-tight text-ink font-display whitespace-nowrap">
            GIJO Tour
          </h1>
        </div>
      </div>

      {/* 우측 단순화 3-컨트롤: 국가 · 게임 · 도구 */}
      <div className="flex items-center gap-1.5 shrink-0" ref={navRef}>
        {/* 1. 국가 / 언어 선택 */}
        {IS_SINGLE_COUNTRY ? (
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 text-ink px-2.5 py-1.5 rounded-full font-bold text-xs whitespace-nowrap">
            <span className="text-sm leading-none">{selectedCountry.flag}</span>
            <span>{selectedCountry.name}</span>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOpenMenu((m) => (m === 'country' ? null : 'country'))}
              aria-haspopup="listbox"
              aria-expanded={openMenu === 'country'}
              aria-label="언어 및 여행 국가 변경"
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-ink px-2.5 py-1.5 rounded-full transition-colors active:scale-95 font-bold text-xs whitespace-nowrap"
              title="언어 및 여행 국가 변경"
            >
              <span className="text-sm leading-none">{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  openMenu === 'country' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openMenu === 'country' && (
              <div className="absolute right-0 mt-2 w-52 max-w-[calc(100vw-1.5rem)] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-150">
                <div className="py-1 max-h-64 overflow-y-auto">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCountry(c);
                        setOpenMenu(null);
                      }}
                      className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs transition-colors ${
                        c.id === selectedCountry.id
                          ? 'bg-slate-50 text-brand font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{c.flag}</span>
                        <div>
                          <div className="font-bold">{c.name}</div>
                          <div className="text-[11px] text-ink-mute">{c.language}</div>
                        </div>
                      </div>
                      {c.id === selectedCountry.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. 게임 라운지 */}
        <button
          onClick={() => {
            setOpenMenu(null);
            (onOpenGameHub ?? onOpenPartyGame)?.();
          }}
          aria-label="GIJO 게임 라운지 (파티 게임 & 아케이드)"
          className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-ink rounded-full text-xs font-bold transition-colors active:scale-95 shrink-0 whitespace-nowrap"
          title="GIJO 게임 라운지"
        >
          <Gamepad2 className="w-3.5 h-3.5 text-brand" />
          <span>게임</span>
        </button>

        {/* 3. 여행 도구 통합 메뉴 (환율·팁 / 입국서류 / AI 질문) */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu((m) => (m === 'tools' ? null : 'tools'))}
            aria-haspopup="menu"
            aria-expanded={openMenu === 'tools'}
            aria-label="여행 도구 메뉴"
            className={`flex items-center justify-center gap-1 px-2.5 py-1.5 border rounded-full text-xs font-bold transition-colors active:scale-95 shrink-0 whitespace-nowrap ${
              openMenu === 'tools'
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-ink'
            }`}
            title="환율·팁, 입국서류, AI 도구"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>도구</span>
          </button>

          {openMenu === 'tools' && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-[100] py-1 animate-in fade-in zoom-in-95 duration-150"
            >
              {onOpenCalculator && (
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenMenu(null);
                    onOpenCalculator();
                  }}
                  aria-label="1초 환율 및 팁·더치페이 계산기"
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left text-xs font-bold text-ink hover:bg-slate-50 transition-colors"
                >
                  <Calculator className="w-4 h-4 text-ink-soft shrink-0" />
                  <div>
                    <div>환율 · 팁 · 1/N 계산기</div>
                    <div className="text-[11px] font-medium text-ink-mute">오프라인 즉시 환산</div>
                  </div>
                </button>
              )}

              {onOpenChecklist && (
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenMenu(null);
                    onOpenChecklist();
                  }}
                  aria-label="출국 1분 체크리스트 열기"
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left text-xs font-bold text-ink hover:bg-slate-50 transition-colors"
                >
                  <CheckSquare className="w-4 h-4 text-ink-soft shrink-0" />
                  <div>
                    <div>출국 1분 체크리스트</div>
                    <div className="text-[11px] font-medium text-ink-mute">여권 · eSIM · 오프라인 음성</div>
                  </div>
                </button>
              )}

              <button
                role="menuitem"
                onClick={() => {
                  setOpenMenu(null);
                  onOpenEntryGuide();
                }}
                aria-label="입국심사 및 필수 서류 가이드"
                className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left text-xs font-bold text-ink hover:bg-slate-50 transition-colors"
              >
                <FileText className="w-4 h-4 text-ink-soft shrink-0" />
                <div>
                  <div>입국서류 가이드</div>
                  <div className="text-[11px] font-medium text-ink-mute">e-Travel · 필수 체크</div>
                </div>
              </button>

              {!IS_STATIC_BUILD && (
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenMenu(null);
                    onOpenAIAssistant();
                  }}
                  aria-label="AI 상황별 맞춤 회화 질문"
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left text-xs font-bold text-ink hover:bg-slate-50 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-brand shrink-0" />
                  <div>
                    <div>AI 맞춤 회화 질문</div>
                    <div className="text-[11px] font-medium text-ink-mute">상황 입력 시 즉시 번역</div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
