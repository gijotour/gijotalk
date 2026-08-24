import React, { useState, useEffect, useRef } from 'react';
import { Country } from '../types';
import { COUNTRIES, IS_SINGLE_COUNTRY, IS_STATIC_BUILD } from '../config';
import { Globe, ChevronDown, Sparkles, ShieldAlert, PartyPopper, Gamepad2, FileText, Languages } from 'lucide-react';

interface HeaderProps {
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
  onOpenAIAssistant: () => void;
  onOpenEmergencyModal: () => void;
  onOpenPartyGame: () => void;
  onOpenArcade: () => void;
  onOpenEntryGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCountry,
  onSelectCountry,
  onOpenAIAssistant,
  onOpenEmergencyModal,
  onOpenPartyGame,
  onOpenArcade,
  onOpenEntryGuide,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 바깥을 누르거나 ESC 를 누르면 국가 목록이 닫히도록 합니다.
  useEffect(() => {
    if (!dropdownOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setDropdownOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-50 bg-canvas/95 backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 border-b border-orange-100 shadow-xs">
      {/* 브랜드 */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="bg-brand p-1.5 rounded-xl text-white shrink-0">
          <Globe className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-black tracking-tight text-ink font-display whitespace-nowrap">
            GIJO Tour
          </h1>
          <p className="text-xs text-ink-mute font-medium whitespace-nowrap hidden md:block">
            지아이조 투어에서 제공하는 일정표 및 생활영어
          </p>
        </div>
      </div>

      {/* Country Selector & Action Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Country & Language Selector */}
        {IS_SINGLE_COUNTRY ? (
          <div className="flex items-center gap-1.5 bg-white border-2 border-accent text-ink px-2.5 py-1 rounded-full font-bold shadow-xs text-xs whitespace-nowrap">
            <span className="text-base leading-none">{selectedCountry.flag}</span>
            <span>{selectedCountry.name}</span>
          </div>
        ) : (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            className="flex items-center gap-1.5 bg-white hover:bg-orange-50/50 border-2 border-accent text-ink px-2.5 py-1 rounded-full transition-all active:scale-95 font-bold shadow-xs text-xs whitespace-nowrap"
            title="언어 및 여행 국가 변경"
          >
            <Languages className="w-3.5 h-3.5 text-brand" />
            <span className="text-base leading-none">{selectedCountry.flag}</span>
            <span>{selectedCountry.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-orange-100 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 bg-canvas border-b border-orange-100 flex items-center justify-between text-xs font-bold text-ink-mute px-3 tracking-wider">
                <span className="flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-brand" />
                  <span>언어 및 국가 변경</span>
                </span>
                <span className="text-[10px] text-brand bg-orange-100/60 px-1.5 py-0.5 rounded-md">선택</span>
              </div>
              <div className="py-1 max-h-64 overflow-y-auto">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCountry(c);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-left text-xs transition-colors ${
                      c.id === selectedCountry.id
                        ? 'bg-orange-50 text-brand font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{c.flag}</span>
                      <div>
                        <div className="font-bold">{c.name}</div>
                        <div className="text-[11px] text-ink-mute">{c.language}</div>
                      </div>
                    </div>
                    {c.id === selectedCountry.id && (
                      <span className="w-2 h-2 rounded-full bg-brand"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        )}

        {/* 입국심사 서류 가이드 버튼 (서류/체크리스트 FileText 아이콘) */}
        <button
          onClick={onOpenEntryGuide}
          aria-label="입국심사 및 필수 서류 가이드"
          className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 whitespace-nowrap"
          title="필리핀·베트남 입국심사 & e-Travel 서류 가이드"
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">입국서류</span>
        </button>

        {/* AI Travel Assistant Trigger — 서버 필요 */}
        {!IS_STATIC_BUILD && (
        <button
          onClick={onOpenAIAssistant}
          aria-label="AI 상황별 맞춤 회화 질문"
          className="flex items-center gap-1 px-2.5 py-1.5 bg-brand hover:bg-brand-hover text-white rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 whitespace-nowrap"
          title="AI 상황별 맞춤 회화 질문"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span className="hidden sm:inline">AI 질문</span>
        </button>
        )}

        {/* 파티 게임 직행 */}
        <button
          onClick={onOpenPartyGame}
          aria-label="파티 게임 실행"
          className="p-1.5 bg-ink text-white hover:bg-black rounded-full transition-all active:scale-95 shrink-0"
          title="파티 게임 실행"
        >
          <PartyPopper className="w-4 h-4" />
        </button>

        {/* 오프라인 아케이드 */}
        <button
          onClick={onOpenArcade}
          aria-label="오프라인 아케이드 게임 실행"
          className="p-1.5 bg-ink text-white hover:bg-black rounded-full transition-all active:scale-95 shrink-0"
          title="오프라인 아케이드 게임 실행"
        >
          <Gamepad2 className="w-4 h-4" />
        </button>

        {/* Emergency Billboard Direct Launch */}
        <button
          onClick={onOpenEmergencyModal}
          aria-label="3초 긴급 전광판 모드 실행"
          className="p-1.5 bg-accent/25 text-alert hover:bg-accent/40 border border-accent/60 rounded-full transition-all active:scale-95 shrink-0"
          title="3초 긴급 전광판 모드 실행"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
