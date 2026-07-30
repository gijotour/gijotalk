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

export interface PracticeResult {
  phraseId: string;
  transcript: string;
  accuracyScore: number;
  matched: boolean;
}
