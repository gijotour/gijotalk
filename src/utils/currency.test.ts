import { describe, it, expect, beforeEach } from 'vitest';
import {
  CURRENCIES,
  currencyForCountry,
  getRateToKRW,
  saveCustomRate,
  resetCustomRate,
  toKRW,
  fromKRW,
  splitAmount,
  TIP_GUIDES,
} from './currency';

describe('currency 유틸리티 (오프라인 환율 & 더치페이 & 팁)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('국가 ID에 맞는 기본 통화 코드를 반환한다', () => {
    expect(currencyForCountry('ph')).toBe('PHP');
    expect(currencyForCountry('vn')).toBe('VND');
    expect(currencyForCountry('en')).toBe('PHP');
  });

  it('필리핀 페소(PHP)와 베트남 동(VND)을 원화로 정확히 환산한다', () => {
    // 100 PHP * 24.5 = 2,450원
    expect(toKRW(100, 'PHP')).toBe(2450);
    // 100,000 VND * 0.055 = 5,500원
    expect(toKRW(100_000, 'VND')).toBe(5500);
    // 10 USD * 1380 = 13,800원
    expect(toKRW(10, 'USD')).toBe(13800);
  });

  it('원화(KRW)에서 현지 통화로 역산한다', () => {
    expect(fromKRW(2450, 'PHP')).toBe(100);
    expect(fromKRW(5500, 'VND')).toBe(100_000);
  });

  it('사용자 지정 환율을 저장하고 초기화할 수 있다', () => {
    saveCustomRate('PHP', 25);
    expect(getRateToKRW('PHP')).toBe(25);
    expect(toKRW(100, 'PHP')).toBe(2500);

    resetCustomRate('PHP');
    expect(getRateToKRW('PHP')).toBe(CURRENCIES.PHP.defaultRateToKRW);
  });

  it('더치페이(1/N) 정산 시 인원수별로 깔끔하게 나누어 계산한다', () => {
    const res = splitAmount(1000, 4, 'PHP', 24);
    expect(res.totalKRW).toBe(24000);
    expect(res.perPersonLocal).toBe(250);
    expect(res.perPersonKRW).toBe(6000);
  });

  it('필리핀과 베트남의 골프·마사지·호텔 표준 팁 가이드를 포함한다', () => {
    expect(TIP_GUIDES.ph.length).toBeGreaterThanOrEqual(4);
    expect(TIP_GUIDES.vn.length).toBeGreaterThanOrEqual(4);
  });
});
