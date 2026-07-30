import React, { useEffect, useState } from 'react';
import {
  Smartphone,
  Download,
  X,
  Check,
  HelpCircle,
  ExternalLink,
  Copy,
  AlertTriangle,
  WifiOff,
} from 'lucide-react';
import {
  isStandalone,
  isIOS,
  isInAppBrowser,
  isKakaoTalk,
  canPromptInstall,
  onInstallAvailabilityChange,
  promptInstall,
} from '../utils/pwa';

const DISMISS_KEY = 'gijo_install_banner_dismissed_v1';

interface InstallBannerProps {
  isOffline: boolean;
}

export const InstallBanner: React.FC<InstallBannerProps> = ({ isOffline }) => {
  const [showGuide, setShowGuide] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [installable, setInstallable] = useState(canPromptInstall());
  const [copied, setCopied] = useState(false);

  const installed = isStandalone();
  const inApp = isInAppBrowser();
  const ios = isIOS();

  useEffect(() => onInstallAvailabilityChange(setInstallable), []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* 사파리 프라이빗 모드 등 */
    }
  };

  const handleInstall = async () => {
    const outcome = await promptInstall();
    if (outcome === 'unavailable') setShowGuide(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setShowGuide(true);
    }
  };

  return (
    <>
      {/* 오프라인 알림 — 설치가 제대로 됐다는 신호이기도 합니다 */}
      {isOffline && (
        <div className="w-full bg-accent text-slate-900 border-b border-amber-600/20 px-4 py-2 text-xs flex items-center gap-2 font-bold shadow-xs">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>오프라인 모드 — 저장된 회화와 발음은 그대로 사용할 수 있습니다</span>
        </div>
      )}

      {/* 인앱 브라우저 경고 — 지인 배포에서 설치 실패의 가장 흔한 원인 */}
      {inApp && !installed && (
        <div className="w-full bg-rose-600 text-white px-4 py-3 text-xs font-bold shadow-md">
          <div className="max-w-screen-md mx-auto flex flex-col sm:flex-row sm:items-center gap-2.5">
            <div className="flex items-start gap-2 flex-1">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-black">
                  {isKakaoTalk() ? '카카오톡' : '인앱'} 브라우저에서는 앱을 설치할 수 없습니다
                </p>
                <p className="text-rose-100 font-medium mt-0.5">
                  우측 하단 <span className="font-black text-white">[⋮ 또는 공유]</span> →{' '}
                  <span className="font-black text-white">
                    [{ios ? 'Safari로 열기' : '다른 브라우저로 열기'}]
                  </span>
                  를 눌러주세요.
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className="shrink-0 px-3.5 py-2 bg-white text-rose-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '복사됨!' : '주소 복사'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 설치 유도 — 이미 설치됐거나 인앱 브라우저면 띄우지 않습니다 */}
      {!installed && !inApp && !dismissed && (
        <div className="w-full bg-orange-100/90 text-slate-800 px-4 py-2.5 border-b border-orange-200 shadow-xs">
          <div className="max-w-screen-md mx-auto flex justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold min-w-0">
              <Download className="w-4 h-4 text-brand shrink-0" />
              <span className="truncate">
                현지에서 인터넷 없이 쓰려면 홈 화면에 추가하세요
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {installable ? (
                <button
                  onClick={handleInstall}
                  className="px-3.5 py-1.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-xs active:scale-95 transition-all shadow-xs"
                >
                  앱 설치
                </button>
              ) : (
                <button
                  onClick={() => setShowGuide(true)}
                  className="px-3 py-1.5 text-brand underline font-bold text-xs flex items-center gap-1"
                >
                  설치 방법 <HelpCircle className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={handleDismiss}
                aria-label="설치 안내 닫기"
                className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 설치 방법 안내 모달 */}
      {showGuide && (
        <div
          className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="홈 화면에 추가하는 방법"
          onClick={(e) => e.target === e.currentTarget && setShowGuide(false)}
        >
          <div className="bg-white border-2 border-orange-100 rounded-3xl max-w-md w-full p-6 text-slate-900 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowGuide(false)}
              aria-label="닫기"
              className="absolute top-4 right-4 p-2 text-ink-mute hover:text-slate-900 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pr-10">
              <div className="p-3 bg-orange-100 text-brand rounded-2xl shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">홈 화면에 GIJO Talk 추가</h3>
                <p className="text-xs text-slate-500 font-bold">
                  추가해야 현지에서 인터넷 없이 열립니다
                </p>
              </div>
            </div>

            <div className="bg-accent/15 border border-accent/60 rounded-2xl p-3.5 mb-4 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-alert shrink-0 mt-0.5" />
              <p className="text-xs text-slate-800 font-bold leading-relaxed">
                카카오톡·인스타그램 안에서 열었다면 먼저{' '}
                <span className="text-alert">Safari 또는 Chrome으로 열어야</span> 합니다.
              </p>
            </div>

            <div className="space-y-3.5 my-5">
              <div
                className={`p-4 rounded-2xl border-2 ${
                  ios ? 'bg-orange-50 border-brand' : 'bg-canvas border-slate-100'
                }`}
              >
                <p className="font-bold text-alert text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  아이폰 (Safari) {ios && <span className="text-brand">← 내 기기</span>}
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 font-medium">
                  <li>
                    화면 하단 중앙 <span className="font-black text-slate-900">[공유 ↑]</span> 버튼
                  </li>
                  <li>
                    스크롤을 내려 <span className="font-black text-slate-900">[홈 화면에 추가]</span>
                  </li>
                  <li>
                    우측 상단 <span className="font-black text-slate-900">[추가]</span>
                  </li>
                </ol>
              </div>

              <div
                className={`p-4 rounded-2xl border-2 ${
                  !ios ? 'bg-blue-50 border-blue-400' : 'bg-canvas border-slate-100'
                }`}
              >
                <p className="font-bold text-blue-700 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  안드로이드 (Chrome) {!ios && <span className="text-blue-600">← 내 기기</span>}
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 font-medium">
                  <li>
                    우측 상단 <span className="font-black text-slate-900">[⋮ 더보기]</span>
                  </li>
                  <li>
                    <span className="font-black text-slate-900">[앱 설치]</span> 또는{' '}
                    <span className="font-black text-slate-900">[홈 화면에 추가]</span>
                  </li>
                  <li>팝업에서 확인</li>
                </ol>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 mb-4 flex items-start gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-900 font-bold leading-relaxed">
                추가한 뒤 <span className="underline">한 번 열어두면</span> 필리핀 회화와 발음이
                기기에 저장되어, 현지에서 데이터 없이 그대로 열립니다.
              </p>
            </div>

            {installable && (
              <button
                onClick={() => {
                  setShowGuide(false);
                  handleInstall();
                }}
                className="w-full py-3.5 mb-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>바로 설치하기</span>
              </button>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-3.5 bg-brand hover:bg-brand-hover text-white font-black rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-md"
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
