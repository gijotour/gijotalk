import React, { useState } from 'react';
import { Smartphone, Download, X, Check, HelpCircle } from 'lucide-react';

interface PWABannerProps {
  isOffline: boolean;
}

export const PWABanner: React.FC<PWABannerProps> = ({ isOffline }) => {
  const [showGuide, setShowGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed && !isOffline) return null;

  return (
    <>
      {/* Offline Alert Strip */}
      {isOffline && (
        <div className="w-full bg-[#FFB800] text-slate-900 border-b border-amber-600/20 px-4 py-2 text-xs flex items-center justify-between font-bold z-[100] shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-ping"></span>
            <span>⚡ 오프라인 모드 작동 중 (60개 현장 회화 및 오디오 내장 지원)</span>
          </div>
        </div>
      )}

      {/* PWA Install Promo Strip */}
      {!dismissed && (
        <div className="w-full bg-orange-100/90 text-slate-800 px-4 py-2.5 flex justify-between items-center z-[90] border-b border-orange-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Download className="w-4 h-4 text-[#FF6B4A] animate-bounce" />
            <span>오프라인 현지 사용을 위해 홈 화면에 앱 추가하기</span>
            <button
              onClick={() => setShowGuide(true)}
              className="ml-1 underline text-[#FF6B4A] hover:text-[#ff5a36] transition-colors font-black flex items-center gap-0.5"
            >
              설치 방법 <HelpCircle className="w-3 h-3 inline" />
            </button>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
            title="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PWA Installation Modal Guide */}
      {showGuide && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-orange-100 rounded-3xl max-w-md w-full p-6 text-slate-900 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 text-[#FF6B4A] rounded-2xl">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">홈 화면에 GIJO Talk 추가하기</h3>
                <p className="text-xs text-slate-500 font-bold">GIJO LABS · 오프라인 현지 필수 회화</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-700 my-6">
              <div className="bg-[#FDFBF7] p-3.5 rounded-2xl border-2 border-slate-100">
                <p className="font-black text-[#D97706] text-xs uppercase tracking-wider mb-1">아이폰 (iOS Safari)</p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600 font-medium">
                  <li>사파리 하단 중앙 <span className="font-extrabold text-slate-900">[공유 ➔]</span> 버튼 클릭</li>
                  <li>스크롤을 내려 <span className="font-extrabold text-slate-900">[홈 화면에 추가]</span> 선택</li>
                  <li>우측 상단 <span className="font-extrabold text-slate-900">[추가]</span> 누르면 끝!</li>
                </ol>
              </div>

              <div className="bg-[#FDFBF7] p-3.5 rounded-2xl border-2 border-slate-100">
                <p className="font-black text-blue-600 text-xs uppercase tracking-wider mb-1">안드로이드 (Android Chrome)</p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600 font-medium">
                  <li>크롬 우측 상단 <span className="font-extrabold text-slate-900">[⋮ 더보기]</span> 클릭</li>
                  <li><span className="font-extrabold text-slate-900">[앱 설치]</span> 또는 <span className="font-extrabold text-slate-900">[홈 화면에 추가]</span> 선택</li>
                  <li>팝업 확인 누르면 독립형 PWA 앱으로 추가 완료!</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-3 bg-[#FF6B4A] hover:bg-[#ff5a36] text-white font-black rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#FF6B4A]/20"
            >
              <Check className="w-4 h-4" />
              <span>확인했습니다</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
