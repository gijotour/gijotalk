import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSavedBookmarkIds,
  saveBookmarkIds,
  toggleBookmarkId,
  isInAppBrowser,
  isKakaoTalk,
} from './pwa';

describe('북마크 저장', () => {
  beforeEach(() => localStorage.clear());

  it('저장한 목록을 그대로 다시 읽는다', () => {
    saveBookmarkIds(['ph-01', 'en-tra-02']);
    expect(getSavedBookmarkIds()).toEqual(['ph-01', 'en-tra-02']);
  });

  /**
   * 회귀 테스트.
   *
   * 예전에는 쓰는 곳과 읽는 곳의 키가 달라('quickpass_bookmarks' vs '..._v1')
   * 저장한 북마크가 새로고침하면 통째로 사라졌습니다.
   * 저장 경로를 saveBookmarkIds 하나로 모아 다시 어긋나지 않게 합니다.
   */
  it('저장과 읽기가 같은 키를 쓴다 (북마크 유실 회귀)', () => {
    saveBookmarkIds(['ph-eme-01']);
    const keys = Object.keys(localStorage);
    expect(keys).toHaveLength(1);
    expect(getSavedBookmarkIds()).toEqual(['ph-eme-01']);
  });

  it('처음 실행하면 빈 목록이다 (가짜 북마크를 미리 넣지 않는다)', () => {
    expect(getSavedBookmarkIds()).toEqual([]);
  });

  it('토글이 추가와 제거를 오간다', () => {
    let ids = toggleBookmarkId('ph-01', []);
    expect(ids).toEqual(['ph-01']);

    ids = toggleBookmarkId('ph-02', ids);
    expect(ids).toEqual(['ph-01', 'ph-02']);

    ids = toggleBookmarkId('ph-01', ids);
    expect(ids).toEqual(['ph-02']);
  });

  /**
   * 회귀 테스트.
   *
   * 예전 toggleBookmarkId 는 localStorage 를 다시 읽어서 동작했습니다.
   * 저장소 값이 화면 상태와 어긋나 있으면 옛 값 위에 덮어쓰게 됩니다.
   * 이제 호출자가 넘긴 현재 상태를 기준으로 합니다.
   */
  it('토글이 localStorage 가 아니라 넘겨받은 목록을 기준으로 한다', () => {
    // 저장소에는 옛 값이 남아 있는 상황
    saveBookmarkIds(['old-1', 'old-2']);

    // 화면 상태는 이미 다른 값
    const current = ['ph-eme-01', 'ph-eme-02'];
    const next = toggleBookmarkId('ph-tra-01', current);

    expect(next).toEqual(['ph-eme-01', 'ph-eme-02', 'ph-tra-01']);
    expect(next).not.toContain('old-1');
    expect(getSavedBookmarkIds()).toEqual(next);
  });

  it('저장된 값이 깨져 있어도 빈 목록으로 복구한다', () => {
    localStorage.setItem('quickpass_bookmarks_v1', '{not json');
    expect(getSavedBookmarkIds()).toEqual([]);
  });

  it('문자열이 아닌 항목은 걸러낸다', () => {
    localStorage.setItem('quickpass_bookmarks_v1', JSON.stringify(['ph-01', 42, null]));
    expect(getSavedBookmarkIds()).toEqual(['ph-01']);
  });
});

describe('인앱 브라우저 감지 — 지인 배포 최대 걸림돌', () => {
  const setUA = (ua: string) =>
    Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true });

  it('카카오톡을 잡아낸다', () => {
    setUA('Mozilla/5.0 (iPhone) KAKAOTALK 10.5.0');
    expect(isInAppBrowser()).toBe(true);
    expect(isKakaoTalk()).toBe(true);
  });

  it('인스타그램·페이스북·라인도 잡아낸다', () => {
    for (const ua of ['Instagram 300.0', 'FBAN/FBIOS', 'Line/13.5.0']) {
      setUA(`Mozilla/5.0 (iPhone) ${ua}`);
      expect(isInAppBrowser(), ua).toBe(true);
    }
  });

  it('일반 Safari·Chrome 은 인앱으로 보지 않는다', () => {
    for (const ua of [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15 Version/17.0 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36',
    ]) {
      setUA(ua);
      expect(isInAppBrowser(), ua).toBe(false);
      expect(isKakaoTalk(), ua).toBe(false);
    }
  });
});
