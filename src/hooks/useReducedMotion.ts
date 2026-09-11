import { useEffect, useState } from 'react';

/**
 * 사용자가 "동작 줄이기" 를 켰는지.
 *
 * index.css 가 전역으로 애니메이션 시간을 0 에 가깝게 줄이지만,
 * 단어 카드 뒤집기처럼 "동작 자체를 걸지 말지" 를 코드에서 정해야 하는 곳이 있습니다.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => query()?.matches ?? false);

  useEffect(() => {
    const mq = query();
    if (!mq) return;
    const handle = (e: MediaQueryListEvent) => setReduced(e.matches);
    // 사파리 구버전은 addEventListener 가 없습니다.
    mq.addEventListener?.('change', handle);
    return () => mq.removeEventListener?.('change', handle);
  }, []);

  return reduced;
}

function query(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)');
  } catch {
    return null;
  }
}
