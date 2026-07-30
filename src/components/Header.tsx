import React, { useState, useEffect, useRef } from 'react';
import { Country } from '../types';
import { COUNTRIES, IS_SINGLE_COUNTRY, IS_STATIC_BUILD } from '../config';
import { Globe, ChevronDown, Sparkles, ShieldAlert, HardDrive } from 'lucide-react';

interface HeaderProps {
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
  onOpenAIAssistant: () => void;
  onOpenEmergencyModal: () => void;
  onOpenDriveModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCountry,
  onSelectCountry,
  onOpenAIAssistant,
  onOpenEmergencyModal,
  onOpenDriveModal,
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
    <header className="sticky top-0 z-50 bg-canvas/95 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between border-b border-orange-100 shadow-xs">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="bg-brand p-2 sm:p-2.5 rounded-xl shadow-md shadow-brand-vivid/20 text-white">
          <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Montserrat']">
              GIJO Talk
            </h1>
            <span className="text-blue-600 bg-blue-50 text-xs sm:text-xs font-bold uppercase px-2 py-0.5 border border-blue-200 rounded-xl tracking-wider">
              GIJO LABS
            </span>
          </div>
          <p className="text-xs text-slate-500 font-bold tracking-wide hidden sm:block">동남아 3초 긴급 현장회화 & 도로소음 오디오</p>
        </div>
      </div>

      {/* Country Selector & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Country Selector — 국가가 하나뿐이면 고정 배지로 표시합니다.
            config.ts 의 ENABLED_COUNTRY_IDS 에 나라를 추가하면 자동으로 드롭다운이 됩니다. */}
        {IS_SINGLE_COUNTRY ? (
          <div className="flex items-center gap-2 bg-white border-2 border-accent text-slate-900 px-3.5 py-1.5 rounded-full font-bold shadow-xs text-xs sm:text-sm">
            <span className="text-lg leading-none">{selectedCountry.flag}</span>
            <span className="font-bold">{selectedCountry.name}</span>
          </div>
        ) : (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            className="flex items-center gap-2 bg-white hover:bg-orange-50/50 border-2 border-accent text-slate-900 px-3.5 py-1.5 rounded-full transition-all active:scale-95 font-bold shadow-xs text-xs sm:text-sm"
          >
            <span className="text-lg leading-none">{selectedCountry.flag}</span>
            <span className="font-bold">{selectedCountry.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border-2 border-orange-100 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 bg-canvas border-b border-orange-100 text-xs font-bold text-ink-mute px-3 uppercase tracking-wider">
                여행 국가 선택
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
                      <span className="font-bold">{c.name}</span>
                    </div>
                    <span className="text-xs text-ink-mute font-medium">{c.language}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        )}

        {/* AI Travel Assistant Trigger — 서버 필요 */}
        {!IS_STATIC_BUILD && (
        <button
          onClick={onOpenAIAssistant}
          aria-label="AI 상황별 맞춤 회화 질문"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand hover:bg-brand-hover text-white rounded-full text-xs font-bold transition-all active:scale-95 shadow-md shadow-brand-vivid/20"
          title="AI 상황별 맞춤 회화 질문"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          {/* 'xs' 는 Tailwind 기본 브레이크포인트가 아니라 이 라벨이 항상 숨어 있었습니다. */}
          <span className="hidden sm:inline">AI 질문</span>
        </button>
        )}

        {/* Google Drive Backup & Sync */}
        {onOpenDriveModal && (
          <button
            onClick={onOpenDriveModal}
            aria-label="Google Drive 백업 및 동기화"
            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-200 rounded-full transition-all active:scale-95 shadow-xs"
            title="Google Drive 백업 및 동기화"
          >
            <HardDrive className="w-4 h-4" />
          </button>
        )}

        {/* Emergency Billboard Direct Launch */}
        <button
          onClick={onOpenEmergencyModal}
          aria-label="3초 긴급 전광판 모드 실행"
          className="p-2 bg-accent/20 text-alert hover:bg-accent/30 border-2 border-accent/60 rounded-full transition-all active:scale-95 shadow-xs"
          title="3초 긴급 전광판 모드 실행"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
