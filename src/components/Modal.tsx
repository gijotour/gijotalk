import React, { useEffect, useRef, useCallback } from 'react';

/**
 * 모든 모달의 공통 껍데기.
 *
 * 예전에는 모달 5개가 각자 `<div className="fixed inset-0">` 였습니다. 그래서
 *   · ESC 로 닫히는 건 일부뿐이었고
 *   · Tab 을 누르면 포커스가 뒤 화면으로 빠져나갔고
 *   · 모달 뒤 배경이 그대로 스크롤됐고
 *   · 스크린리더에 그냥 div 로 읽혔습니다.
 * 한 곳에 모아 다섯 군데가 같은 동작을 갖도록 했습니다.
 */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export type ModalVariant = 'center' | 'sheet' | 'fullscreen';

interface ModalProps {
  onClose: () => void;
  /** 스크린리더가 읽을 모달 이름 */
  label: string;
  children: React.ReactNode;
  variant?: ModalVariant;
  /** 바깥(배경)을 눌렀을 때 닫을지. 전광판처럼 실수로 닫히면 곤란한 화면은 false */
  closeOnBackdrop?: boolean;
  /** 배경 컨테이너에 덧붙일 클래스 */
  className?: string;
  /** 내용 래퍼에 덧붙일 클래스 */
  panelClassName?: string;
}

const BACKDROP: Record<ModalVariant, string> = {
  center: 'fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4',
  sheet:
    'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-4',
  fullscreen: 'fixed inset-0 z-[200]',
};

export const Modal: React.FC<ModalProps> = ({
  onClose,
  label,
  children,
  variant = 'center',
  closeOnBackdrop = true,
  className = '',
  panelClassName = '',
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const focusables = useCallback((): HTMLElement[] => {
    if (!panelRef.current) return [];
    // 레이아웃(offsetParent)에 의존하지 않습니다. 그건 실제 브라우저에서만 값이 있고,
    // 테스트 환경에서는 항상 null 이라 포커스 대상을 하나도 못 찾습니다.
    const nodes = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)) as HTMLElement[];
    return nodes.filter(
      (el) => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true'
    );
  }, []);

  // 열릴 때 첫 요소로 포커스를 옮기고, 닫힐 때 원래 자리로 되돌립니다.
  // 되돌리지 않으면 모달을 닫은 뒤 Tab 이 페이지 맨 위부터 다시 시작합니다.
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const first = focusables()[0];
    if (first) first.focus();
    else panelRef.current?.focus();

    return () => {
      previouslyFocused.current?.focus?.();
    };
  }, [focusables]);

  // 뒤 배경 스크롤 잠금.
  // 모달이 겹쳐 열릴 수 있으므로 원래 값을 저장했다가 복원합니다.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // ESC 로 닫기 + Tab 포커스 가두기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      // 끝에서 Tab → 처음으로, 처음에서 Shift+Tab → 끝으로 되감습니다.
      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (panelRef.current && !panelRef.current.contains(active)) {
        // 어떤 이유로든 포커스가 밖으로 새면 다시 안으로 끌어옵니다.
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [onClose, focusables]);

  return (
    <div
      className={`${BACKDROP[variant]} ${className}`}
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={panelClassName}
      >
        {children}
      </div>
    </div>
  );
};
