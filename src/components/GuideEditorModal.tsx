import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from './Modal';
import { GUIDE_CODE } from '../utils/env';
import { Itinerary } from '../types';
import { ITINERARY_TEMPLATE_FILE, parseItinerary } from '../utils/itinerary';
import { BASE_URL } from '../utils/env';
import { buildItineraryLink } from '../utils/itineraryLink';
import {
  X,
  PencilLine,
  Link2,
  Check,
  AlertCircle,
  AlertTriangle,
  Save,
  FileDown,
  Lock,
} from 'lucide-react';

const UNLOCK_KEY = 'gijo_guide_mode_v1';

/** 가이드 모드가 이미 열린 기기인지. 매번 코드를 다시 치게 하면 아무도 안 씁니다. */
export function isGuideUnlocked(): boolean {
  try {
    return localStorage.getItem(UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

function rememberUnlock(): void {
  try {
    localStorage.setItem(UNLOCK_KEY, '1');
  } catch {
    // 저장이 막혀도 이번 세션에서는 쓸 수 있습니다.
  }
}

export function lockGuideMode(): void {
  try {
    localStorage.removeItem(UNLOCK_KEY);
  } catch {
    /* 무시 */
  }
}

interface GuideEditorModalProps {
  /** 지금 기기에 저장된 일정표의 원문 — 있으면 이어서 고칩니다 */
  initialText?: string;
  onClose: () => void;
  /** 이 기기에 저장하기 */
  onSave: (itinerary: Itinerary) => void;
}

/**
 * 가이드 모드 — 앱 안에서 일정표를 직접 쓰고 링크로 뿌립니다.
 *
 * 메모장을 왕복하지 않아도 되고, 틀린 줄이 그 자리에서 바로 보입니다.
 * 완성하면 링크 하나가 나오고, 그걸 카톡방에 붙여넣으면 누른 사람 전원이
 * 같은 일정표를 갖게 됩니다 — 서버 없이 "전체 반영" 에 가장 가까운 방법입니다.
 */
export const GuideEditorModal: React.FC<GuideEditorModalProps> = ({
  initialText,
  onClose,
  onSave,
}) => {
  const [unlocked, setUnlocked] = useState(() => isGuideUnlocked());
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);

  const [text, setText] = useState(initialText ?? '');
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  // 한 글자 칠 때마다 다시 읽습니다. 순수 문자열 처리라 서버도 지연도 없습니다.
  const parsed = useMemo(() => parseItinerary(text), [text]);

  // 내용이 바뀌면 앞서 만든 링크는 옛 내용입니다. 즉시 버립니다.
  useEffect(() => {
    setLink(null);
    setCopied(false);
  }, [text]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (codeInput.trim() === GUIDE_CODE) {
      rememberUnlock();
      setUnlocked(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  const loadTemplate = async () => {
    try {
      const res = await fetch(`${BASE_URL}${ITINERARY_TEMPLATE_FILE}`);
      // 양식 파일에는 BOM 이 붙어 있습니다(윈도우 메모장 대응). 편집창에는 빼고 넣습니다 —
      // 안 그러면 저장할 때 BOM 이 두 번 붙습니다.
      setText((await res.text()).replace(/^\uFEFF/, ''));
    } catch {
      setLinkError('양식을 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.');
    }
  };

  const handleMakeLink = async () => {
    setLinkError(null);
    try {
      const url = await buildItineraryLink(text);
      setLink(url);
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      } catch {
        // 클립보드가 막힌 브라우저 — 아래 상자에서 직접 복사하면 됩니다.
      }
    } catch {
      setLinkError('링크를 만들지 못했습니다.');
    }
  };

  const handleDownload = () => {
    // ⚠️ BOM 을 반드시 붙입니다.
    //
    //   윈도우 메모장은 BOM 이 없는 파일을 UTF-8 이 아니라 ANSI(CP949)로 열어서
    //   한글이 통째로 깨집니다. charset=utf-8 을 지정해도 소용없습니다 —
    //   그건 다운로드 시점의 힌트일 뿐, 파일 안에는 남지 않기 때문입니다.
    //   파서는 BOM 을 떼고 읽으므로 다시 올려도 문제없습니다.
    const blob = new Blob(['\uFEFF' + text.replace(/^\uFEFF/, '')], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '일정표.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------------------------------------------------------------- */
  /* 코드 입력                                                          */
  /* ---------------------------------------------------------------- */
  if (!unlocked) {
    return (
      <Modal
        onClose={onClose}
        label="가이드 모드 코드 입력"
        panelClassName="bg-white border-2 border-orange-100 rounded-3xl max-w-sm w-full text-ink shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <form onSubmit={handleUnlock} className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-ink rounded-xl text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm">가이드 모드</h3>
              <p className="text-xs text-ink-mute font-medium">일정표를 직접 쓰고 링크로 보냅니다</p>
            </div>
          </div>

          <input
            type="password"
            value={codeInput}
            onChange={(e) => {
              setCodeInput(e.target.value);
              setCodeError(false);
            }}
            autoFocus
            aria-label="가이드 코드"
            placeholder="코드를 입력하세요"
            className="w-full bg-canvas border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm text-ink placeholder-ink-mute focus:outline-none focus:border-brand-vivid"
          />

          {codeError && (
            <p className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              코드가 맞지 않습니다.
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-ink-soft text-xs font-bold rounded-xl"
            >
              닫기
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-brand text-white text-xs font-bold rounded-xl active:scale-95 transition-all"
            >
              들어가기
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  /* ---------------------------------------------------------------- */
  /* 편집                                                              */
  /* ---------------------------------------------------------------- */
  const itinerary = parsed.itinerary;
  const itemCount = itinerary?.days.reduce((n, d) => n + d.items.length, 0) ?? 0;

  return (
    <Modal
      onClose={onClose}
      label="가이드 모드 — 일정표 작성"
      variant="sheet"
      panelClassName="bg-white border-2 border-orange-100 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full text-ink shadow-2xl max-h-[92vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-center justify-between p-5 border-b border-orange-100 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-ink rounded-xl text-white shrink-0">
            <PencilLine className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-sm">일정표 작성</h3>
            <p className="text-xs text-ink-mute font-medium truncate">
              양식대로 쓰면 아래에서 바로 확인됩니다
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="p-2 text-ink-mute hover:text-ink rounded-full bg-slate-100 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-4 flex-1">
        {!text && (
          <button
            onClick={loadTemplate}
            className="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl text-xs font-bold text-ink-soft hover:border-brand hover:text-brand transition-colors"
          >
            양식 예시 불러와서 고치기
          </button>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="일정표 내용"
          spellCheck={false}
          placeholder={'#기조톡일정 v1\n제목: …\n\n[2026-08-01] 1일차\n09:00 | 이동 | … @장소'}
          className="w-full h-72 bg-canvas border-2 border-slate-200 rounded-2xl p-4 text-xs font-mono text-ink placeholder-ink-mute focus:outline-none focus:border-brand-vivid resize-y leading-relaxed"
        />

        {/* 실시간 확인 — 틀린 줄이 그 자리에서 보여야 메모장 왕복이 사라집니다 */}
        {text.trim() && (
          <div className="space-y-2">
            {parsed.error ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{parsed.error}</span>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-start gap-2">
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  {itinerary!.days.length}일 · 일정 {itemCount}개 · 특이사항{' '}
                  {itinerary!.notices.length}건 · 연락처 {itinerary!.contacts.length}개
                </span>
              </div>
            )}

            {parsed.warnings.length > 0 && (
              <div className="p-3 bg-accent/20 border border-accent rounded-2xl space-y-1">
                <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-alert" />
                  건너뛴 줄 {parsed.warnings.length}개
                </p>
                {parsed.warnings.slice(0, 6).map((w, i) => (
                  <p key={i} className="text-xs text-ink-soft font-medium break-words">
                    {w}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 만들어진 링크.
            2천 자가 넘어서 통째로 뿌리면 화면을 다 잡아먹고 정작 안내 문구가 밀립니다.
            복사가 됐으면 앞부분만 보여주고, 복사가 막힌 브라우저에서만 전문을 펼칩니다. */}
        {link && (
          <div className="space-y-2">
            {copied ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <p className="text-xs font-mono text-emerald-800 truncate">{link.slice(0, 48)}…</p>
              </div>
            ) : (
              <textarea
                readOnly
                value={link}
                onFocus={(e) => e.currentTarget.select()}
                aria-label="일정표 링크"
                className="w-full h-28 bg-canvas border-2 border-slate-200 rounded-2xl p-3 text-xs font-mono text-ink-soft break-all resize-none"
              />
            )}
            <p className="text-xs font-bold text-ink-soft">
              {copied ? '복사했습니다. ' : '위 주소를 전부 선택해 복사하세요. '}
              카톡방에 붙여넣으면 누른 분 전원에게 이 일정표가 들어갑니다. ({link.length}자)
            </p>
            <p className="text-xs text-ink-mute font-medium leading-relaxed">
              링크를 가진 사람은 누구나 볼 수 있습니다. 공개된 곳에는 올리지 마세요. 내용을 고치면
              링크를 다시 만들어 보내야 합니다 — 이미 받은 분에게 저절로 갱신되지는 않습니다.
            </p>
          </div>
        )}

        {linkError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{linkError}</span>
          </div>
        )}
      </div>

      {/* 동작 */}
      <div
        className="p-5 border-t border-orange-100 shrink-0 space-y-2"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleMakeLink}
          disabled={!itinerary}
          className="w-full py-3.5 bg-brand text-white text-sm font-extrabold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40 disabled:active:scale-100"
        >
          {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          {copied ? '링크 복사됨' : '카톡에 보낼 링크 만들기'}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => itinerary && onSave(itinerary)}
            disabled={!itinerary}
            className="flex-1 py-3 bg-slate-100 text-ink text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" />내 폰에 저장
          </button>
          <button
            onClick={handleDownload}
            disabled={!text.trim()}
            className="flex-1 py-3 bg-slate-100 text-ink text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <FileDown className="w-3.5 h-3.5" />
            파일로 저장
          </button>
        </div>
      </div>
    </Modal>
  );
};
