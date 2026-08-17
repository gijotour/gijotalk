import { CountryId, Country, Phrase } from './types';
export { IS_STATIC_BUILD } from './utils/env';
import { COUNTRIES as BASE_COUNTRIES, PHRASES as BASE_PHRASES } from './data/phrases';
import { PH_EXTRA_PHRASES } from './data/phrases.ph';
import { PH_SOCIAL_PHRASES } from './data/phrases.ph.social';
import { PH_TOUR_PHRASES } from './data/phrases.ph.tour';
import { PH_FOOD_PHRASES } from './data/phrases.ph.food';
import { VN_EXTRA_PHRASES } from './data/phrases.vn';
import { VN_SOCIAL_PHRASES } from './data/phrases.vn.social';
import { VN_TOUR_PHRASES } from './data/phrases.vn.tour';
import { VN_FOOD_PHRASES } from './data/phrases.vn.food';
import { EN_COUNTRY, EN_PHRASES } from './data/phrases.en';
import { EN_SOCIAL_PHRASES } from './data/phrases.en.social';
import { EN_TOUR_PHRASES } from './data/phrases.en.tour';
import { EN_FOOD_PHRASES } from './data/phrases.en.food';

/**
 * 지금 화면에 노출할 언어.
 *
 * 필리핀은 영어가 공용어라 타갈로그 ↔ 영어를 나란히 두는 구성입니다.
 * 베트남도 필리핀과 같은 수준(카테고리 전체)으로 채워 열었습니다.
 * 나머지 나라(태국·인도네시아·라오스)는 데이터는 그대로 있지만 숨겨져 있습니다.
 *
 *   나중에 열 때:  ['ph', 'en', 'vn', 'th', 'id', 'la']
 *
 * 노출 언어가 1개면 헤더의 선택 드롭다운이 자동으로 고정 배지가 되고,
 * 2개 이상이면 다시 드롭다운으로 돌아옵니다. 지금은 3개(필리핀·영어·베트남)라
 * 드롭다운입니다.
 *
 * ⚠️ 베트남은 아직 사전 생성된 오디오 파일이 없습니다(scripts/check-audio.ts
 *    참고). 음성은 브라우저 내장 TTS(vi-VN)로 대체 재생됩니다 — 기기에
 *    vi-VN 음성이 없거나 iOS PWA 환경이면 소리가 안 날 수 있습니다.
 */
export const ENABLED_COUNTRY_IDS: CountryId[] = ['ph', 'en', 'vn'];

/** 5개국 + 영어 트랙 전체 (숨김 포함) */
const ALL_COUNTRIES: Country[] = [...BASE_COUNTRIES, EN_COUNTRY];

const ALL_PHRASES: Phrase[] = [
  ...BASE_PHRASES,
  ...PH_EXTRA_PHRASES,
  ...PH_SOCIAL_PHRASES,
  ...PH_TOUR_PHRASES,
  ...PH_FOOD_PHRASES,
  ...VN_EXTRA_PHRASES,
  ...VN_SOCIAL_PHRASES,
  ...VN_TOUR_PHRASES,
  ...VN_FOOD_PHRASES,
  ...EN_PHRASES,
  ...EN_SOCIAL_PHRASES,
  ...EN_TOUR_PHRASES,
  ...EN_FOOD_PHRASES,
];

export const COUNTRIES: Country[] = ENABLED_COUNTRY_IDS.map((id) =>
  ALL_COUNTRIES.find((c) => c.id === id)
).filter((c): c is Country => Boolean(c));

export const PHRASES: Phrase[] = ALL_PHRASES.filter((p) =>
  ENABLED_COUNTRY_IDS.includes(p.countryId)
);

export const IS_SINGLE_COUNTRY = COUNTRIES.length === 1;

export const getCountryById = (id: CountryId): Country | undefined =>
  COUNTRIES.find((c) => c.id === id);
