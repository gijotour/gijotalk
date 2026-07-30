import React, { useState } from 'react';
import { Country, CountryId } from '../types';
import { COUNTRIES } from '../data/phrases';
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

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between border-b border-orange-100 shadow-xs">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="bg-[#FF6B4A] p-2 sm:p-2.5 rounded-xl shadow-md shadow-[#FF6B4A]/20 text-white">
          <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Montserrat']">
              GIJO Talk
            </h1>
            <span className="text-blue-600 bg-blue-50 text-[10px] sm:text-[11px] font-black uppercase px-2 py-0.5 border border-blue-200 rounded-md tracking-wider">
              GIJO LABS
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-bold tracking-wide hidden sm:block">동남아 3초 긴급 현장회화 & 도로소음 오디오</p>
        </div>
      </div>

      {/* Country Selector & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Country Selector Dropdown Pill */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-white hover:bg-orange-50/50 border-2 border-[#FFB800] text-slate-900 px-3.5 py-1.5 rounded-full transition-all active:scale-95 font-bold shadow-xs text-xs sm:text-sm"
          >
            <span className="text-lg leading-none">{selectedCountry.flag}</span>
            <span className="font-bold">{selectedCountry.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border-2 border-orange-100 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 bg-[#FDFBF7] border-b border-orange-100 text-[11px] font-black text-slate-400 px-3 uppercase tracking-wider">
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
                        ? 'bg-orange-50 text-[#FF6B4A] font-extrabold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{c.flag}</span>
                      <span className="font-bold">{c.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{c.language}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Travel Assistant Trigger */}
        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B4A] hover:bg-[#ff5a36] text-white rounded-full text-xs font-bold transition-all active:scale-95 shadow-md shadow-[#FF6B4A]/20"
          title="AI 상황별 맞춤 회화 질문"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span className="hidden xs:inline">AI 질문</span>
        </button>

        {/* Google Drive Backup & Sync */}
        {onOpenDriveModal && (
          <button
            onClick={onOpenDriveModal}
            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-200 rounded-full transition-all active:scale-95 shadow-xs"
            title="Google Drive 백업 및 동기화"
          >
            <HardDrive className="w-4 h-4" />
          </button>
        )}

        {/* Emergency Billboard Direct Launch */}
        <button
          onClick={onOpenEmergencyModal}
          className="p-2 bg-[#FFB800]/20 text-[#D97706] hover:bg-[#FFB800]/30 border-2 border-[#FFB800]/60 rounded-full transition-all active:scale-95 shadow-xs"
          title="3초 긴급 전광판 모드 실행"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
