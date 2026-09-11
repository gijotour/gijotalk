// 필리핀 (타갈로그 + 영어 병기). DATA 에이전트가 채웁니다 — 아래는 UI 가 컴파일되도록 둔 샘플 2개입니다.
import type { VocabWord, VocabExpression, VocabDialog } from '../../types';

export const PH_WORDS: VocabWord[] = [
  { id: 'vw-ph-hotel-01', countryId: 'ph', unitId: 'hotel', emoji: '🔑', word: 'susi', wordEn: 'key', meaning: '열쇠', pronunciation: '[수시]', pronunciationEn: '[키]' },
  { id: 'vw-ph-hotel-02', countryId: 'ph', unitId: 'hotel', emoji: '🛏️', word: 'kuwarto', wordEn: 'room', meaning: '방', pronunciation: '[쿠와르토]', pronunciationEn: '[룸]' },
];
export const PH_EXPRESSIONS: VocabExpression[] = [
  { id: 've-ph-hotel-01', countryId: 'ph', unitId: 'hotel', text: 'Susi po, pakiusap.', textEn: 'Key, please.', meaning: '열쇠 주세요.', pronunciation: '[수시 포, 파키우삽]', pronunciationEn: '[키, 플리즈]', wordIds: ['vw-ph-hotel-01'] },
];
export const PH_DIALOGS: VocabDialog[] = [];
