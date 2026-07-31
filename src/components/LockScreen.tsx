import React, { useState } from 'react';
import { BASE_URL } from '../utils/env';
import { LOCK_CONTACT, tryUnlock } from '../utils/appLock';
import { Lock, Loader2, AlertCircle, Phone } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

/**
 * 앱 잠금 화면.
 *
 * 번호가 맞을 때까지 앱의 어떤 화면도 그리지 않습니다.
 * 한 번 풀면 그 기기에서는 다시 묻지 않습니다 — 현지에서 열 때마다 번호를
 * 치게 하면 아무도 안 씁니다.
 */
export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);
  const [wrong, setWrong] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || checking) return;

    setChecking(true);
    setWrong(false);
    // 확인에 20만 회 해시가 필요해 0.05초쯤 걸립니다. 그동안 버튼을 잠급니다.
    const ok = await tryUnlock(code);
    setChecking(false);

    if (ok) onUnlock();
    else {
      setWrong(true);
      setCode('');
    }
  };

  return (
    <div
      className="min-h-screen bg-canvas text-ink flex flex-col items-center justify-center px-6 font-['Inter']"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <img
        src={`${BASE_URL}icon-192.png`}
        alt=""
        className="w-20 h-20 rounded-2xl shadow-md"
      />

      <h1 className="mt-5 text-lg font-black text-slate-900 font-['Montserrat'] tracking-tight">
        GIJO Tour(PH)
      </h1>
      <p className="mt-1 text-xs font-bold text-ink-mute">필리핀 여행 일정표 · 현장회화</p>

      <form onSubmit={submit} className="w-full max-w-xs mt-8 space-y-3">
        <div className="flex items-center gap-2 justify-center text-ink-soft">
          <Lock className="w-4 h-4" />
          <span className="text-xs font-bold">비밀번호를 입력하세요</span>
        </div>

        <input
          type="password"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setWrong(false);
          }}
          // 폰에서 숫자 자판이 바로 뜨게 합니다.
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          aria-label="비밀번호"
          aria-invalid={wrong}
          className={`w-full bg-white border-2 rounded-2xl px-4 py-3.5 text-center text-lg font-black tracking-[0.4em] text-ink focus:outline-none ${
            wrong ? 'border-rose-400' : 'border-slate-200 focus:border-brand-vivid'
          }`}
        />

        {wrong && (
          <p className="text-xs font-bold text-rose-600 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            비밀번호가 맞지 않습니다.
          </p>
        )}

        <button
          type="submit"
          disabled={!code.trim() || checking}
          className="w-full py-3.5 bg-brand text-white text-sm font-extrabold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40 disabled:active:scale-100"
        >
          {checking && <Loader2 className="w-4 h-4 animate-spin" />}
          {checking ? '확인 중…' : '들어가기'}
        </button>
      </form>

      {/* 번호를 모르는 사람이 여기서 막히지 않게, 물어볼 곳을 바로 띄웁니다. */}
      <div className="mt-8 text-center">
        <p className="text-xs font-bold text-ink-soft">
          비밀번호는 {LOCK_CONTACT.company}에 문의하세요
        </p>
        <a
          href={`tel:${LOCK_CONTACT.phone.replace(/[^\d+]/g, '')}`}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-black text-ink active:scale-95 transition-all"
        >
          <Phone className="w-4 h-4 text-brand" />
          {LOCK_CONTACT.phone}
        </a>
      </div>

      <p className="mt-8 text-xs text-ink-mute font-bold">
        <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-xl border border-blue-200">
          GIJO LABS
        </span>{' '}
        제공
      </p>
    </div>
  );
};
