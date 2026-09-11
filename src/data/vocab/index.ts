// 어휘 학습 데이터 진입점. UI 는 이 파일에서만 읽습니다.
// 설계: docs/VOCAB_PLAN.md. 내용은 units.ts / ph.ts / vn.ts 에서 채웁니다.
import type { VocabUnit, VocabWord, VocabExpression, VocabDialog } from '../../types';
import { VOCAB_UNITS } from './units';
import { PH_WORDS, PH_EXPRESSIONS, PH_DIALOGS } from './ph';
import { VN_WORDS, VN_EXPRESSIONS, VN_DIALOGS } from './vn';

export { VOCAB_UNITS };
export const VOCAB_WORDS: VocabWord[] = [...PH_WORDS, ...VN_WORDS];
export const VOCAB_EXPRESSIONS: VocabExpression[] = [...PH_EXPRESSIONS, ...VN_EXPRESSIONS];
export const VOCAB_DIALOGS: VocabDialog[] = [...PH_DIALOGS, ...VN_DIALOGS];

export const unitById = (id: string): VocabUnit | undefined => VOCAB_UNITS.find((u) => u.id === id);
