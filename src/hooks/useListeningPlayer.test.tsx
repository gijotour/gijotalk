import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useListeningPlayer } from './useListeningPlayer';
import { audioLog } from '../test/setup';
import { COUNTRIES, PHRASES } from '../config';
import { Phrase } from '../types';

const ph = COUNTRIES.find((c) => c.id === 'ph')!;

// 테스트를 빠르게 돌리기 위한 짧은 간격. UI 는 1·2·3초만 노출하지만 훅은 임의 값을 받습니다.
const GAP = 0.2;
const list = PHRASES.filter((p) => p.countryId === 'ph').slice(0, 4);

/** act 로 감싼 대기. 타이머가 유발하는 상태 변경을 React 가 인지하게 합니다. */
const advance = (ms: number) => act(() => new Promise<void>((r) => setTimeout(r, ms)));

/** 재생된 파일 경로에서 문장 id 만 뽑습니다. */
const playedIds = () => audioLog.played.map((src) => src.split('/').pop()!.replace(/\.\w+$/, ''));

describe('useListeningPlayer — 연속 재생 엔진', () => {
  beforeEach(() => {
    audioLog.played.length = 0;
  });

  it('재생을 시작하면 첫 문장이 나온다', async () => {
    const { result } = renderHook(() => useListeningPlayer(list, ph));

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isActive).toBe(false);

    act(() => result.current.play(0));

    expect(result.current.isPlaying).toBe(true);
    expect(result.current.isActive).toBe(true);
    expect(playedIds()).toEqual([list[0].id]);
  });

  /**
   * 이 앱에서 가장 오래 살아있던 버그의 회귀 테스트입니다.
   *
   * 예전 구현은 onEnd 콜백이 isPlaying "state" 를 읽었습니다. 콜백은 등록 시점의
   * 렌더에 묶이므로 그 값은 영원히 false 였고, 결과적으로 "무한 연속 듣기"가
   * 정확히 한 문장만 재생하고 멈췄습니다.
   */
  it('첫 문장이 끝나면 스스로 다음으로 넘어간다 (stale closure 회귀)', async () => {
    const { result } = renderHook(() => useListeningPlayer(list, ph));

    act(() => {
      result.current.setRepeatCount(1);
      result.current.setIntervalGap(GAP);
    });
    act(() => result.current.play(0));

    // 문장1 → (간격) → 문장2 → (간격) → 문장3
    await waitFor(() => expect(playedIds().length).toBeGreaterThanOrEqual(3), { timeout: 4000 });

    expect(playedIds().slice(0, 3)).toEqual([list[0].id, list[1].id, list[2].id]);
    expect(result.current.isPlaying).toBe(true);
  });

  it('반복 횟수만큼 같은 문장을 되풀이한 뒤 넘어간다', async () => {
    const { result } = renderHook(() => useListeningPlayer(list, ph));

    act(() => {
      result.current.setRepeatCount(2);
      result.current.setIntervalGap(GAP);
    });
    act(() => result.current.play(0));

    await waitFor(() => expect(playedIds().length).toBeGreaterThanOrEqual(3), { timeout: 4000 });

    // 1번을 두 번 → 2번으로
    expect(playedIds().slice(0, 3)).toEqual([list[0].id, list[0].id, list[1].id]);
  });

  it('마지막 문장 다음에는 처음으로 돌아간다 (무한 반복)', async () => {
    const two = list.slice(0, 2);
    const { result } = renderHook(() => useListeningPlayer(two, ph));

    act(() => {
      result.current.setRepeatCount(1);
      result.current.setIntervalGap(GAP);
    });
    act(() => result.current.play(0));

    await waitFor(() => expect(playedIds().length).toBeGreaterThanOrEqual(3), { timeout: 4000 });
    expect(playedIds().slice(0, 3)).toEqual([two[0].id, two[1].id, two[0].id]);
  });

  it('정지하면 더 이상 진행하지 않는다', async () => {
    const { result } = renderHook(() => useListeningPlayer(list, ph));

    act(() => {
      result.current.setRepeatCount(1);
      result.current.setIntervalGap(GAP);
    });
    act(() => result.current.play(0));
    act(() => result.current.stop());

    expect(result.current.isPlaying).toBe(false);
    const countAtStop = playedIds().length;

    await advance(600);
    expect(playedIds().length).toBe(countAtStop);
  });

  it('재생 도중 반복/속도 설정을 바꾸면 즉시 반영된다', async () => {
    const { result } = renderHook(() => useListeningPlayer(list, ph));

    act(() => {
      result.current.setRepeatCount(1);
      result.current.setIntervalGap(GAP);
    });
    act(() => result.current.play(0));

    // 재생 중에 반복을 2회로 변경
    act(() => result.current.setRepeatCount(2));

    await waitFor(() => expect(playedIds().length).toBeGreaterThanOrEqual(3), { timeout: 4000 });

    // 설정이 stale 이면 [0,1,2] 가 나옵니다. 반영되면 어딘가에서 같은 문장이 연달아 나옵니다.
    const ids = playedIds().slice(0, 4);
    const hasRepeat = ids.some((id, i) => i > 0 && id === ids[i - 1]);
    expect(hasRepeat).toBe(true);
  });

  it('다음/이전으로 건너뛸 수 있고 목록 끝에서 순환한다', () => {
    const { result } = renderHook(() => useListeningPlayer(list, ph));

    act(() => result.current.play(0));
    expect(result.current.currentIndex).toBe(0);

    act(() => result.current.next());
    expect(result.current.currentIndex).toBe(1);

    act(() => result.current.prev());
    expect(result.current.currentIndex).toBe(0);

    act(() => result.current.prev());
    expect(result.current.currentIndex).toBe(list.length - 1);
  });

  it('toggle 이 재생/정지를 오간다', () => {
    const { result } = renderHook(() => useListeningPlayer(list, ph));

    act(() => result.current.toggle());
    expect(result.current.isPlaying).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isPlaying).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.isPlaying).toBe(true);
  });

  it('dismiss 는 재생을 끄고 미니 플레이어까지 닫는다', () => {
    const { result } = renderHook(() => useListeningPlayer(list, ph));

    act(() => result.current.play(2));
    expect(result.current.isActive).toBe(true);

    act(() => result.current.dismiss());
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isActive).toBe(false);
    expect(result.current.currentIndex).toBe(0);
  });

  /**
   * 미니 플레이어를 만든 이유 자체를 검증합니다.
   *
   * 엔진이 App 에 있으므로, 플레이어 화면(모달)이 사라져도 훅은 계속 살아 있어야 합니다.
   * 예전에는 엔진이 모달 안에 있어서 닫는 순간 재생이 끊겼습니다.
   */
  it('플레이어 화면을 닫아도(=모달 언마운트) 재생이 이어진다', async () => {
    // 모달은 이 훅을 소유하지 않습니다. 훅은 App(여기서는 renderHook)에 살아 있습니다.
    const { result } = renderHook(() => useListeningPlayer(list, ph));

    act(() => {
      result.current.setRepeatCount(1);
      result.current.setIntervalGap(GAP);
    });
    act(() => result.current.play(0));

    const before = playedIds().length;

    // "모달을 닫는다" = 훅과 무관한 UI 상태 변화. 훅은 건드리지 않습니다.
    await advance(600);

    expect(playedIds().length).toBeGreaterThan(before);
    expect(result.current.isPlaying).toBe(true);
  });

  it('재생 목록이 실제로 바뀌면 정지하고 처음으로 되감는다', async () => {
    const { result, rerender } = renderHook(
      ({ items }: { items: Phrase[] }) => useListeningPlayer(items, ph),
      { initialProps: { items: list } }
    );

    act(() => result.current.play(2));
    expect(result.current.currentIndex).toBe(2);
    expect(result.current.isActive).toBe(true);

    // 카테고리를 바꾼 상황 — 다른 문장 집합
    const other = PHRASES.filter((p) => p.countryId === 'en').slice(0, 3);
    rerender({ items: other });

    await waitFor(() => expect(result.current.isActive).toBe(false));
    expect(result.current.currentIndex).toBe(0);
  });

  it('같은 목록이 새 배열로 다시 와도 재생이 끊기지 않는다', async () => {
    // 부모가 리렌더될 때마다 배열 참조가 바뀝니다.
    // 참조로 비교하면 재생 중 계속 1번으로 되감기던 버그가 있었습니다.
    const { result, rerender } = renderHook(
      ({ items }: { items: Phrase[] }) => useListeningPlayer(items, ph),
      { initialProps: { items: list } }
    );

    act(() => result.current.play(2));
    expect(result.current.currentIndex).toBe(2);

    rerender({ items: [...list] }); // 내용은 같고 참조만 다름

    expect(result.current.currentIndex).toBe(2);
    expect(result.current.isPlaying).toBe(true);
  });
});
