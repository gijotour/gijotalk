// 'en' 은 나라가 아니라 "영어 트랙"입니다.
// 필리핀은 영어가 공용어라 타갈로그와 영어를 나란히 쓰는 게 실전에서 가장 효과적입니다.
export type CountryId = 'ph' | 'en' | 'vn' | 'th' | 'id' | 'la';

export type CategoryId = '전체' | '항공' | '호텔' | '교통' | '식당' | '흥정' | '미팅/사교' | '욕설/은어' | '비상';

export interface Phrase {
  id: string;
  countryId: CountryId;
  category: CategoryId;
  original: string;       // 현지어 원문 (예: Para po!)
  translation: string;    // 한국어 의미 (예: 여기 세워주세요)
  pronunciation: string;  // 한국어 발음 기호 (예: [파라 포!])
  toneGuide?: string;     // 성조/표현 가이드 (예: Standard, 존댓말 표현 등)
  usageTip?: string;      // 현장 사용 팁 (예: 지프니 하차 시 큰 소리로 외치세요)
  isEmergency?: boolean;  // 3초 긴급 전광판 모드에 적합한 문장 여부
  audioUrl?: string;
}

export interface Country {
  id: CountryId;
  name: string;
  flag: string;
  language: string;
  langCode: string; // SpeechSynthesis BCP 47 language tag
  categories: CategoryId[];
  description: string;
}

export interface AudioSettings {
  speed: number; // 0.8, 1.0, 1.2
  noiseActive: boolean;
  noiseVolume: number; // 0.0 to 1.0
}

/* ------------------------------------------------------------------ */
/* 일정표                                                              */
/* ------------------------------------------------------------------ */
//
// 가이드가 정해진 양식(.txt)으로 적어 카톡·텔레그램으로 보내면,
// 여행자가 그 파일 하나만 앱에 올려서 봅니다. 서버도 AI 도 쓰지 않습니다.
// 파싱 규칙은 utils/itinerary.ts, 양식 원본은 public/itinerary-template.txt.

export type ItineraryKind =
  | '집합' | '항공' | '이동' | '식사' | '투어' | '숙소' | '쇼핑' | '자유' | '기타';

export interface ItineraryItem {
  /** 화면에 그대로 보여줄 시간 문자열 ("06:30", "오후 2시"). 없을 수 있습니다. */
  time?: string;
  /** 정렬·"다음 일정" 계산용 자정 기준 분. 시간을 못 읽으면 없습니다. */
  minutes?: number;
  kind: ItineraryKind;
  title: string;
  /** 내용 뒤 "@..." — 기사에게 폰을 보여줄 현지 표기 */
  place?: string;
  note?: string;
  /**
   * 신청자만 가는 옵션 일정.
   * 내용이 "(옵션)" 으로 시작하면 붙습니다. 확정 일정이 아니므로
   * "다음 일정" 알림에서는 빼야 합니다 — 신청 안 한 사람에게는 오알림입니다.
   */
  optional?: boolean;
}

export interface ItineraryDay {
  date: string;   // 'YYYY-MM-DD'
  label: string;  // "1일차 · 출국"
  items: ItineraryItem[];
}

export interface ItineraryContact {
  label: string;
  phone?: string;
}

export interface Itinerary {
  title: string;
  period?: string;
  contacts: ItineraryContact[];
  /** 특이사항 — 일정 스크롤에 묻히면 안 되는 것들 */
  notices: string[];
  days: ItineraryDay[];
  /** 기기에 저장한 시각 (ISO) */
  savedAt: string;
  /**
   * 읽어들인 원문 그대로.
   * 가이드가 이어서 고치거나 링크를 다시 만들 때 필요합니다 —
   * 파싱 결과에서 원문을 복원하면 가이드가 쓴 주석·줄바꿈이 사라집니다.
   */
  source?: string;
  /**
   * 구글시트에서 가져온 경우 그 주소.
   *
   * 이게 있으면 앱을 열 때마다 최신 내용을 다시 받아옵니다. 파일·링크로 받은
   * 일정표는 "그 순간의 사본" 이라 가이드가 고치면 다시 보내야 하지만,
   * 시트로 연결하면 가이드가 시트만 고치면 됩니다.
   */
  sheetUrl?: string;
  /** 시트에서 마지막으로 받아온 시각 (ISO) */
  syncedAt?: string;
}

export interface PracticeResult {
  phraseId: string;
  transcript: string;
  accuracyScore: number;
  matched: boolean;
}
