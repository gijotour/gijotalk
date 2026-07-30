import React, { useState } from 'react';
import {
  isAnalyticsEnabled,
  setAnalyticsEnabled,
  hasSeenNotice,
  markNoticeSeen,
} from '../utils/analytics';
import { Info, Check, X } from 'lucide-react';

/**
 * 사용 기록 수집 안내와 켜고 끄기.
 *
 * 지인에게 쓰라고 준 앱이라 "몰래 모으다 들키는" 상황이 관계에 직접 타격입니다.
 * 그래서 첫 실행에 무엇을 모으는지 명시하고, 끄는 스위치를 푸터에 항상 노출합니다.
 */

/** 첫 실행 고지 — 한 번 보고 나면 다시 뜨지 않습니다. */
export const PrivacyNotice: React.FC = () => {
  const [dismissed, setDismissed] = useState(hasSeenNotice);

  if (dismissed) return null;

  const close = (enabled: boolean) => {
    setAnalyticsEnabled(enabled);
    markNoticeSeen();
    setDismissed(true);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-slate-100 text-ink-soft rounded-xl shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-ink">사용 기록을 조금 모읍니다</h4>
          <p className="text-sm text-ink-soft font-medium mt-1 leading-relaxed">
            어떤 문장이 부족한지 알기 위해 <b>검색어 · AI 질문 · 재생 기록</b>만 익명으로
            모읍니다. 계정·위치·연락처는 수집하지 않고, 아래 스위치로 언제든 끌 수 있습니다.
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => close(true)}
              className="px-3.5 py-2 bg-brand hover:bg-brand-hover text-white text-sm font-bold rounded-xl active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              도와줄게요
            </button>
            <button
              onClick={() => close(false)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-ink-soft text-sm font-bold rounded-xl active:scale-95 transition-all flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              안 보낼래요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/** 푸터에 항상 떠 있는 스위치. */
export const PrivacyToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(isAnalyticsEnabled);

  const toggle = () => {
    const next = !enabled;
    setAnalyticsEnabled(next);
    markNoticeSeen();
    setEnabled(next);
  };

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={enabled}
      className="flex items-center gap-2 text-xs font-bold text-ink-soft hover:text-ink transition-colors"
      title={
        enabled
          ? '검색어·AI 질문·재생 기록을 익명으로 보냅니다. 눌러서 끌 수 있습니다.'
          : '사용 기록을 보내지 않습니다.'
      }
    >
      <span
        className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
          enabled ? 'bg-emerald-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`w-4 h-4 bg-white rounded-full shadow-xs transition-transform ${
            enabled ? 'translate-x-4' : ''
          }`}
        />
      </span>
      <span>사용 기록 {enabled ? '보내는 중' : '끔'}</span>
    </button>
  );
};
