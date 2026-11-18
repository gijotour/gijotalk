import React, { useEffect, useState } from 'react';
import { Country } from '../types';
import {
  getOfflineStatus,
  downloadAudioForOffline,
  estimatedSizeMB,
  OfflineStatus,
} from '../utils/offlineAudio';
import { CloudDownload, CheckCircle2, Loader2, WifiOff, AlertTriangle } from 'lucide-react';

interface OfflineAudioCardProps {
  country: Country;
  isOffline: boolean;
  /** 메인 화면 등 상단 배너용 1줄 컴팩트 모드 (이미 저장 완료 시 숨김) */
  compact?: boolean;
}

export const OfflineAudioCard: React.FC<OfflineAudioCardProps> = ({
  country,
  isOffline,
  compact = false,
}) => {
  const [status, setStatus] = useState<OfflineStatus | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 언마운트 뒤에 상태를 건드리지 않도록 막습니다.
  // (탭을 빠르게 옮기면 응답이 늦게 도착해 경고가 납니다)
  useEffect(() => {
    let alive = true;
    getOfflineStatus(country.id).then((s) => {
      if (alive) setStatus(s);
    });
    return () => {
      alive = false;
    };
  }, [country.id]);

  const handleDownload = async () => {
    setDownloading(true);
    setProgress(0);
    try {
      const result = await downloadAudioForOffline(country.id, (done, total) =>
        setProgress(Math.round((done / total) * 100))
      );
      setStatus(result);
    } finally {
      setDownloading(false);
    }
  };

  if (!status || status.total === 0) return null;

  const pct = status.total ? Math.round((status.cached / status.total) * 100) : 0;

  if (compact) {
    if (status.complete) return null;
    return (
      <div className="bg-slate-900 text-white rounded-2xl px-3.5 py-2.5 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0">
              {isOffline ? (
                <WifiOff className="w-4 h-4" />
              ) : (
                <CloudDownload className="w-4 h-4" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black truncate">
                {country.flag} {country.name} 발음 오프라인 저장
              </p>
              <p className="text-[11px] text-slate-300 font-medium truncate">
                {isOffline
                  ? '온라인일 때 먼저 받아 두면 비행기에서도 재생돼요'
                  : `${status.total}개 (${estimatedSizeMB(country.id)}) · 출국 전 한 번만 받기`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading || isOffline}
            aria-label={`${country.name} 오프라인 발음 지금 받기`}
            className="shrink-0 min-h-9 px-3 bg-brand hover:bg-brand-hover disabled:bg-slate-700 disabled:text-slate-400 text-white text-xs font-black rounded-xl active:scale-95 transition-all flex items-center gap-1.5"
          >
            {downloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{progress}%</span>
              </>
            ) : (
              <span>받기</span>
            )}
          </button>
        </div>
        {downloading && (
          <div className="h-1 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`p-3.5 rounded-2xl border ${
        status.complete
          ? 'bg-emerald-50/70 border-emerald-200/80'
          : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              status.complete ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-ink'
            }`}
          >
            {status.complete ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <CloudDownload className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-bold text-ink truncate">
              {status.complete
                ? `${country.flag} ${country.name} 발음 오프라인 저장 완료`
                : `${country.flag} ${country.name} 발음 기기에 저장하기`}
            </h4>
            <p className="text-[11px] text-ink-mute font-medium mt-0.5 truncate">
              {status.complete
                ? `${status.total}개 저장됨 · 데이터 없이 재생 가능`
                : `${status.total}개 (${estimatedSizeMB(country.id)}) · 출국 전 Wi-Fi 권장`}
            </p>

            {!status.complete && status.cached > 0 && (
              <p className="text-[11px] text-brand font-bold mt-0.5">
                {status.cached}/{status.total}개 ({pct}%) 저장됨
              </p>
            )}
          </div>
        </div>

        {!status.complete && (
          <button
            onClick={handleDownload}
            disabled={downloading || isOffline}
            className="shrink-0 px-3.5 py-2 bg-slate-900 hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center gap-1.5"
          >
            {downloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{progress}%</span>
              </>
            ) : (
              <span>받기</span>
            )}
          </button>
        )}
      </div>

      {downloading && (
        <div className="mt-3 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {isOffline && !status.complete && (
        <p className="mt-3 text-xs text-alert font-bold flex items-center gap-1.5">
          <WifiOff className="w-4 h-4 shrink-0" />
          인터넷에 연결되면 받을 수 있습니다.
        </p>
      )}

      {!status.complete && !isOffline && (
        <p className="mt-3 text-xs text-slate-500 font-medium flex items-start gap-1.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-alert" />
          저장하지 않으면 현지에서 발음이 재생되지 않을 수 있습니다.
        </p>
      )}
    </div>
  );
};
