import { CountryId } from '../types';

export type CurrencyCode = 'PHP' | 'VND' | 'USD';

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  /** 1 현지통화 당 원화(KRW) 기준 환율 (예: 1 PHP = 24.5 KRW, 1 VND = 0.055 KRW, 1 USD = 1380 KRW) */
  defaultRateToKRW: number;
  /** 환율 표기 단위 (PHP=1, USD=1, VND=100) */
  displayUnit: number;
  /** 원터치 빠른 금액 추가 버튼 */
  quickAmounts: Array<{ label: string; value: number }>;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  PHP: {
    code: 'PHP',
    symbol: '₱',
    name: '필리핀 페소',
    flag: '🇵🇭',
    defaultRateToKRW: 24.5,
    displayUnit: 1,
    quickAmounts: [
      { label: '+50₱', value: 50 },
      { label: '+100₱', value: 100 },
      { label: '+500₱', value: 500 },
      { label: '+1,000₱', value: 1000 },
    ],
  },
  VND: {
    code: 'VND',
    symbol: '₫',
    name: '베트남 동',
    flag: '🇻🇳',
    defaultRateToKRW: 0.055, // 100 VND = 5.5 KRW (10,000 VND = 550원)
    displayUnit: 100,
    quickAmounts: [
      { label: '+10k (1만)', value: 10_000 },
      { label: '+50k (5만)', value: 50_000 },
      { label: '+100k (10만)', value: 100_000 },
      { label: '+200k (20만)', value: 200_000 },
      { label: '+500k (50만)', value: 500_000 },
    ],
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: '미국 달러',
    flag: '🇺🇸',
    defaultRateToKRW: 1380,
    displayUnit: 1,
    quickAmounts: [
      { label: '+$1', value: 1 },
      { label: '+$5', value: 5 },
      { label: '+$10', value: 10 },
      { label: '+$50', value: 50 },
      { label: '+$100', value: 100 },
    ],
  },
};

export interface TipGuideItem {
  id: string;
  category: '골프' | '마사지' | '호텔/교통';
  title: string;
  amountText: string;
  amountValue: number;
  currency: CurrencyCode;
  note: string;
}

export const TIP_GUIDES: Record<'ph' | 'vn', TipGuideItem[]> = {
  ph: [
    {
      id: 'ph-tip-golf',
      category: '골프',
      title: '⛳ 18홀 캐디 팁 (1인 기준)',
      amountText: '500 ~ 700 PHP',
      amountValue: 500,
      currency: 'PHP',
      note: '필리핀 골프장 표준 매너팁 (27홀/36홀은 비례 증액)',
    },
    {
      id: 'ph-tip-massage-60',
      category: '마사지',
      title: '💆‍♂️ 마사지 60분~90분 팁',
      amountText: '100 PHP',
      amountValue: 100,
      currency: 'PHP',
      note: '로컬/일반 스파 테라피스트 매너팁',
    },
    {
      id: 'ph-tip-massage-120',
      category: '마사지',
      title: '✨ 고급 스파 / 120분 스톤 마사지 팁',
      amountText: '200 PHP',
      amountValue: 200,
      currency: 'PHP',
      note: '정성스러운 2시간 코스에 적합한 팁',
    },
    {
      id: 'ph-tip-hotel',
      category: '호텔/교통',
      title: '🏨 호텔 벨보이 / 하우스키핑 팁',
      amountText: '50 ~ 100 PHP',
      amountValue: 50,
      currency: 'PHP',
      note: '짐 운반 시 또는 침대 위 매너팁 (동전 대신 지폐 권장)',
    },
  ],
  vn: [
    {
      id: 'vn-tip-golf',
      category: '골프',
      title: '⛳ 18홀 캐디 팁 (1인 기준)',
      amountText: '400,000 ~ 500,000 VND',
      amountValue: 500_000,
      currency: 'VND',
      note: '다낭·나트랑·하노이 정규홀 표준 캐디팁 (약 20달러 상당)',
    },
    {
      id: 'vn-tip-massage-60',
      category: '마사지',
      title: '💆‍♂️ 마사지 60분 팁',
      amountText: '50,000 ~ 100,000 VND',
      amountValue: 50_000,
      currency: 'VND',
      note: '팁 별도 스파 기준 (팁 포함 여부는 사전 확인)',
    },
    {
      id: 'vn-tip-massage-90',
      category: '마사지',
      title: '✨ 마사지 90분~120분 팁',
      amountText: '100,000 ~ 150,000 VND',
      amountValue: 100_000,
      currency: 'VND',
      note: '90분 이상 전신/핫스톤 마사지 표준 매너팁',
    },
    {
      id: 'vn-tip-hotel',
      category: '호텔/교통',
      title: '🏨 호텔 벨보이 / 객실 매너팁',
      amountText: '20,000 ~ 50,000 VND',
      amountValue: 20_000,
      currency: 'VND',
      note: '1~2달러 상당의 베트남 동 지폐',
    },
  ],
};

const CUSTOM_RATES_KEY = 'gijo_custom_currency_rates_v1';

export function currencyForCountry(countryId: CountryId): CurrencyCode {
  if (countryId === 'vn') return 'VND';
  if (countryId === 'ph') return 'PHP';
  return 'PHP';
}

export function getSavedRates(): Partial<Record<CurrencyCode, number>> {
  try {
    const raw = localStorage.getItem(CUSTOM_RATES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed;
  } catch {
    return {};
  }
}

export function getRateToKRW(code: CurrencyCode): number {
  const saved = getSavedRates()[code];
  if (typeof saved === 'number' && Number.isFinite(saved) && saved > 0) {
    return saved;
  }
  return CURRENCIES[code].defaultRateToKRW;
}

export function saveCustomRate(code: CurrencyCode, rateToKRW: number): void {
  if (!Number.isFinite(rateToKRW) || rateToKRW <= 0) return;
  try {
    const current = getSavedRates();
    current[code] = rateToKRW;
    localStorage.setItem(CUSTOM_RATES_KEY, JSON.stringify(current));
  } catch {
    // ignore storage errors
  }
}

export function resetCustomRate(code: CurrencyCode): void {
  try {
    const current = getSavedRates();
    delete current[code];
    localStorage.setItem(CUSTOM_RATES_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

/** 현지 금액 ➔ 원화(KRW) 반올림 계산 */
export function toKRW(localAmount: number, code: CurrencyCode, customRate?: number): number {
  if (!Number.isFinite(localAmount) || localAmount <= 0) return 0;
  const rate = customRate ?? getRateToKRW(code);
  return Math.round(localAmount * rate);
}

/** 원화(KRW) ➔ 현지 금액 환산 */
export function fromKRW(krwAmount: number, code: CurrencyCode, customRate?: number): number {
  if (!Number.isFinite(krwAmount) || krwAmount <= 0) return 0;
  const rate = customRate ?? getRateToKRW(code);
  if (rate <= 0) return 0;
  const raw = krwAmount / rate;
  if (code === 'VND') {
    return Math.round(raw / 1000) * 1000;
  }
  return Math.round(raw * 10) / 10;
}

/** 더치페이 (1/N) 정산 계산 */
export function splitAmount(
  localAmount: number,
  people: number,
  code: CurrencyCode,
  customRate?: number
): { perPersonLocal: number; perPersonKRW: number; totalKRW: number } {
  const safePeople = Math.max(1, Math.min(50, Math.floor(people || 1)));
  const totalKRW = toKRW(localAmount, code, customRate);
  const rawLocal = localAmount / safePeople;
  const perPersonLocal =
    code === 'VND' ? Math.ceil(rawLocal / 1000) * 1000 : Math.ceil(rawLocal);
  const perPersonKRW = Math.ceil(totalKRW / safePeople / 10) * 10;
  return { perPersonLocal, perPersonKRW, totalKRW };
}

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString('ko-KR');
}
