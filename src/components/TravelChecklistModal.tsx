import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import type { Country } from '../types';
import {
  downloadAudioForOffline,
  getOfflineStatus,
  type OfflineStatus,
} from '../utils/offlineAudio';
import {
  CheckSquare,
  Square,
  RotateCcw,
  X,
  CloudDownload,
  CheckCircle2,
  Loader2,
  FileText,
} from 'lucide-react';

export const TRIP_CHECKLIST_KEY = 'gijo_trip_checklist_v1';

interface ChecklistItemDef {
  id: string;
  title: string;
  desc: string;
}

const CHECKLIST_ITEMS: ChecklistItemDef[] = [
  {
    id: 'passport',
    title: '여권 유효기간 6개월 이상',
    desc: '만료 임박 시 입국이 거절될 수 있어요.',
  },
  {
    id: 'entry',
    title: 'e-Travel · 입국신고 QR 캡처',
    desc: '출국 72시간 전 작성 후 오프라인 이미지로 보관.',
  },
  {
    id: 'esim',
    title: '유심 / eSIM · 로밍 개통 확인',
    desc: '현지 공항 도착 즉시 데이터·그랩 호출용.',
  },
  {
    id: 'audio',
    title: '오프라인 발음 기기에 저장',
    desc: '기내·로컬 골목에서 데이터 없이 재생.',
  },
  {
    id: 'cash',
    title: '소액 현금 + 트래블 카드 2장',
    desc: '큰 지폐 거스름돈 부족 대비 소액권 챙기기.',
  },
  {
    id: 'hotel',
    title: '숙소 영문 주소 오프라인 메모',
    desc: '택시 기사에게 바로 보여줄 주소 준비.',
  },
];

function readCheckedIds(): string[] {
  try {
    const raw = localStorage.getItem(TRIP_CHECKLIST_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

interface TravelChecklistModalProps {
  country: Country;
  isOffline: boolean;
  onClose: () => void;
  onOpenEntryGuide?: () => void;
}

/**
 * 출국 전 1분 오프라인 준비 체크리스트.
 * 로컬 localStorage 기반이라 비행기 모드/정적 배포에서도 100% 동작합니다.
 */
export const TravelChecklistModal: React.FC<TravelChecklistModalProps> = ({
  country,
  isOffline,
  onClose,
  onOpenEntryGuide,
}) => {
  const [checkedIds, setCheckedIds] = useState<string[]>(() => readCheckedIds());
  const [audioStatus, setAudioStatus] = useState<OfflineStatus | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let alive = true;
    getOfflineStatus(country.id).then((status) => {
      if (!alive) return;
      setAudioStatus(status);
      if (status.complete) {
        setCheckedIds((prev) => {
          if (prev.includes('audio')) return prev;
          const next = [...prev, 'audio'];
          try {
            localStorage.setItem(TRIP_CHECKLIST_KEY, JSON.stringify(next));
          } catch {
            /* ignore */
          }
          return next;
        });
      }
    });
    return () => {
      alive = false;
    };
  }, [country.id]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(TRIP_CHECKLIST_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const resetAll = () => {
    setCheckedIds([]);
    try {
      localStorage.removeItem(TRIP_CHECKLIST_KEY);
    } catch {
      /* ignore */
    }
  };

  const handleDownloadAudio = async () => {
    if (downloading || isOffline) return;
    setDownloading(true);
    try {
      const result = await downloadAudioForOffline(country.id);
      setAudioStatus(result);
      if (result.complete && !checkedIds.includes('audio')) {
        toggleItem('audio');
      }
    } finally {
      setDownloading(false);
    }
  };

  const doneCount = checkedIds.length;
  const totalCount = CHECKLIST_ITEMS.length;
  const pct = Math.round((doneCount / totalCount) * 100);

  return (
    <Modal onClose={onClose} label="출국 1분 체크리스트">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-5 text-ink shadow-2xl space-y-4">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">출국 1분 체크리스트</h3>
            <p className="text-xs font-medium text-ink-mute mt-0.5">
              {country.flag} {country.name} 출발 전 꼭 확인할 6가지
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="체크리스트 닫기"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-ink-soft flex items-center justify-center active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 진행률 바 */}
        <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-ink-soft">준비 진행률</span>
            <span className="text-brand font-black">
              {doneCount} / {totalCount} ({pct}%)
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand transition-all duration-200"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* 항목 리스트 */}
        <ul className="space-y-2 max-h-[54vh] overflow-y-auto pr-0.5">
          {CHECKLIST_ITEMS.map((item) => {
            const checked = checkedIds.includes(item.id);
            return (
              <li
                key={item.id}
                className={`rounded-2xl border p-3 transition-colors ${
                  checked
                    ? 'bg-emerald-50/70 border-emerald-200/90'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-pressed={checked}
                    className="flex-1 flex items-start gap-2.5 text-left min-w-0"
                  >
                    <span className={`mt-0.5 shrink-0 ${checked ? 'text-emerald-600' : 'text-ink-mute'}`}>
                      {checked ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block text-xs font-black ${
                          checked ? 'text-emerald-900 line-through' : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="block text-[11px] font-medium text-ink-mute mt-0.5">
                        {item.desc}
                      </span>
                    </span>
                  </button>

                  {item.id === 'entry' && onOpenEntryGuide && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenEntryGuide();
                      }}
                      className="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-ink flex items-center gap-1 active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>가이드</span>
                    </button>
                  )}

                  {item.id === 'audio' && audioStatus && (
                    audioStatus.complete ? (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        완료
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleDownloadAudio}
                        disabled={downloading || isOffline}
                        className="shrink-0 px-2.5 py-1.5 rounded-xl bg-brand text-white disabled:bg-slate-300 text-[11px] font-black flex items-center gap-1 active:scale-95"
                      >
                        {downloading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CloudDownload className="w-3.5 h-3.5" />
                        )}
                        <span>{downloading ? '받는중' : '저장'}</span>
                      </button>
                    )
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* 하단 액션 */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={resetAll}
            className="px-3.5 min-h-11 rounded-xl border border-slate-200 text-xs font-bold text-ink-soft hover:bg-slate-50 flex items-center gap-1.5 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>초기화</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-11 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black active:scale-95"
          >
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
};
