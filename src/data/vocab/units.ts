import type { VocabUnit } from '../../types';

/** 10개 단원, 여행 흐름 순. docs/VOCAB_PLAN.md §2 */
export const VOCAB_UNITS: VocabUnit[] = [
  { id: 'airport', order: 1, title: '공항', emoji: '✈️', description: '비행기 타고 내릴 때 쓰는 말', category: '항공' },
  { id: 'hotel', order: 2, title: '호텔', emoji: '🏨', description: '방에 들어가고 나올 때 쓰는 말', category: '호텔' },
  { id: 'transport', order: 3, title: '택시·이동', emoji: '🚕', description: '차 타고 어디로 갈 때 쓰는 말', category: '교통' },
  { id: 'restaurant', order: 4, title: '식당', emoji: '🍽️', description: '자리에 앉아 주문할 때 쓰는 말', category: '식당' },
  { id: 'food', order: 5, title: '음식·음료', emoji: '🍜', description: '먹고 마시는 것 이름', category: '음식' },
  { id: 'market', order: 6, title: '시장·흥정', emoji: '🛍️', description: '물건 사고 값 깎을 때 쓰는 말', category: '흥정' },
  { id: 'sightseeing', order: 7, title: '관광', emoji: '🏝️', description: '구경 다닐 때 쓰는 말', category: '관광' },
  { id: 'massage', order: 8, title: '마사지·스파', emoji: '💆', description: '마사지 받을 때 쓰는 말', category: '마사지' },
  { id: 'friends', order: 9, title: '친구 사귀기', emoji: '🤝', description: '인사하고 친해질 때 쓰는 말', category: '미팅/사교' },
  { id: 'emergency', order: 10, title: '비상', emoji: '🆘', description: '아프거나 곤란할 때 쓰는 말', category: '비상' },
];
