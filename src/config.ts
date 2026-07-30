import { CountryId, Country, Phrase } from './types';
export { IS_STATIC_BUILD } from './utils/env';
import { COUNTRIES as BASE_COUNTRIES, PHRASES as BASE_PHRASES } from './data/phrases';
import { PH_EXTRA_PHRASES } from './data/phrases.ph';
import { PH_SOCIAL_PHRASES } from './data/phrases.ph.social';
import { EN_COUNTRY, EN_PHRASES } from './data/phrases.en';
import { EN_SOCIAL_PHRASES } from './data/phrases.en.social';

/**
 * 지금 화면에 노출할 언어.
 *
 * 필리핀은 영어가 공용어라 타갈로그 ↔ 영어를 나란히 두는 구성입니다.
 * 나머지 나라(베트남·태국·인도네시아·라오스)는 데이터는 그대로 있지만 숨겨져 있습니다.
 *
 *   나중에 열 때:  ['ph', 'en', 'vn', 'th', 'id', 'la']
 *
 * 노출 언어가 1개면 헤더의 선택 드롭다운이 자동으로 고정 배지가 되고,
 * 2개 이상이면 다시 드롭다운으로 돌아옵니다.
 */
export const ENABLED_COUNTRY_IDS: CountryId[] = ['ph', 'en'];

/** 5개국 + 영어 트랙 전체 (숨김 포함) */
const ALL_COUNTRIES: Country[] = [...BASE_COUNTRIES, EN_COUNTRY];

const ALL_PHRASES: Phrase[] = [
  ...BASE_PHRASES,
  ...PH_EXTRA_PHRASES,
  ...PH_SOCIAL_PHRASES,
  ...EN_PHRASES,
  ...EN_SOCIAL_PHRASES,
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
