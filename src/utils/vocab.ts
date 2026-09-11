// 어휘 학습 — 저장·진행도·변환 유틸리티.
//
// 설계: docs/VOCAB_PLAN.md §5(저장), §7(오디오).
// 서버가 없습니다. 전부 localStorage 이고, 저장소가 막힌 브라우저(사파리
// 프라이빗 등)에서도 앱이 죽으면 안 되므로 모든 접근을 try/catch 로 감쌉니다.
//
// 재사용 규칙 하나가 중요합니다:
//   단어·짧은 말·대화 한 줄을 Phrase 로 바꿔서(`vocabAsPhrase`) 기존
//   `playPhrase` 와 `BillboardModal` 을 그대로 씁니다. 어휘 전용 재생기를
//   새로 만들면 오디오 폴백·iOS 잠금 해제 같은 이미 해결한 문제를 다시
//   풀어야 합니다.

import type {
  CountryId,
  Phrase,
  VocabDialog,
  VocabDialogLine,
  VocabExpression,
  VocabProgress,
  VocabUnitId,
  VocabWord,
} from '../types';
import { PHRASES } from '../config';
import {
  VOCAB_UNITS,
  VOCAB_WORDS,
  VOCAB_EXPRESSIONS,
  VOCAB_DIALOGS,
} from '../data/vocab';

/* ------------------------------------------------------------------ */
/* 저장 키 (docs/VOCAB_PLAN.md §5)                                      */
/* ------------------------------------------------------------------ */

export const VOCAB_SAVED_KEY = 'gijo_vocab_saved_v1';
export const VOCAB_PROGRESS_KEY = 'gijo_vocab_progress_v1';
export const VOCAB_UNIT_DONE_KEY = 'gijo_vocab_unit_done_v1';

/* ------------------------------------------------------------------ */
/* 안전한 읽기/쓰기                                                      */
/* ------------------------------------------------------------------ */

function readStringArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    return [];
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('어휘 저장 실패:', e);
  }
}

const toCount = (v: unknown): number =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : 0;

/* ------------------------------------------------------------------ */
/* 저장한 항목 (단어·짧은 말·대화 공통)                                    */
/* ------------------------------------------------------------------ */

export function getSavedVocabIds(): string[] {
  return readStringArray(VOCAB_SAVED_KEY);
}

export function saveVocabIds(ids: string[]): void {
  writeJson(VOCAB_SAVED_KEY, ids);
}

/**
 * 저장/해제를 뒤집습니다.
 * 문장 북마크(`utils/pwa.toggleBookmarkId`)와 같은 방식입니다 — 저장소를 다시
 * 읽지 않고 호출자가 넘긴 목록 위에서 계산합니다. 재조회하면 화면 상태와
 * 어긋난 값에 덮어쓰게 됩니다.
 */
export function toggleVocabId(id: string, current: string[]): string[] {
  const updated = current.includes(id)
    ? current.filter((v) => v !== id)
    : [...current, id];
  saveVocabIds(updated);
  return updated;
}

/* ------------------------------------------------------------------ */
/* 진행 기록                                                            */
/* ------------------------------------------------------------------ */

export type VocabProgressMap = Record<string, VocabProgress>;

export function getVocabProgress(): VocabProgressMap {
  try {
    const raw = localStorage.getItem(VOCAB_PROGRESS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    const out: VocabProgressMap = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
      const record = value as Partial<VocabProgress>;
      out[id] = {
        seen: toCount(record.seen),
        correct: toCount(record.correct),
        wrong: toCount(record.wrong),
        lastAt: toCount(record.lastAt),
      };
    }
    return out;
  } catch {
    return {};
  }
}

export function saveVocabProgress(progress: VocabProgressMap): void {
  writeJson(VOCAB_PROGRESS_KEY, progress);
}

const emptyProgress = (): VocabProgress => ({ seen: 0, correct: 0, wrong: 0, lastAt: 0 });

/** 카드를 뒤집거나 들었을 때. "봤다" 는 횟수만 올립니다. */
export function recordSeen(id: string, current: VocabProgressMap): VocabProgressMap {
  const prev = current[id] ?? emptyProgress();
  const updated: VocabProgressMap = {
    ...current,
    [id]: { ...prev, seen: prev.seen + 1, lastAt: Date.now() },
  };
  saveVocabProgress(updated);
  return updated;
}

/** 퀴즈 정답/오답. 오답이 많은 항목이 다음 세트에서 먼저 나옵니다. */
export function recordAnswer(
  id: string,
  correct: boolean,
  current: VocabProgressMap
): VocabProgressMap {
  const prev = current[id] ?? emptyProgress();
  const updated: VocabProgressMap = {
    ...current,
    [id]: {
      ...prev,
      seen: prev.seen + 1,
      correct: prev.correct + (correct ? 1 : 0),
      wrong: prev.wrong + (correct ? 0 : 1),
      lastAt: Date.now(),
    },
  };
  saveVocabProgress(updated);
  return updated;
}

/* ------------------------------------------------------------------ */
/* 단원 도장                                                            */
/* ------------------------------------------------------------------ */

/** 도장 키는 나라별로 따로 찍힙니다 — 필리핀을 다 했다고 베트남이 끝난 건 아닙니다. */
export const unitStampId = (countryId: CountryId, unitId: VocabUnitId): string =>
  `${countryId}:${unitId}`;

export function getUnitDoneIds(): string[] {
  return readStringArray(VOCAB_UNIT_DONE_KEY);
}

export function saveUnitDoneIds(ids: string[]): void {
  writeJson(VOCAB_UNIT_DONE_KEY, ids);
}

export function markUnitDone(stamp: string, current: string[]): string[] {
  if (current.includes(stamp)) return current;
  const updated = [...current, stamp];
  saveUnitDoneIds(updated);
  return updated;
}

/* ------------------------------------------------------------------ */
/* 데이터 조회                                                          */
/* ------------------------------------------------------------------ */

/** 대화 한 줄에 붙이는 합성 id. 오디오 매니페스트 키와 같은 규칙입니다. */
export interface VocabDialogLineItem extends VocabDialogLine {
  id: string; // `${dialogId}-L1`
  countryId: CountryId;
  unitId: VocabUnitId;
  dialogId: string;
  lineNo: number; // 1부터
}

export type VocabItem = VocabWord | VocabExpression | VocabDialogLineItem;

export const isVocabWord = (item: VocabItem): item is VocabWord => 'word' in item;
export const isVocabExpression = (item: VocabItem): item is VocabExpression =>
  'wordIds' in item;

export function dialogLineItems(dialog: VocabDialog): VocabDialogLineItem[] {
  return dialog.lines.map((line, i) => ({
    ...line,
    id: `${dialog.id}-L${i + 1}`,
    countryId: dialog.countryId,
    unitId: dialog.unitId,
    dialogId: dialog.id,
    lineNo: i + 1,
  }));
}

/**
 * 영어 트랙(`en`)은 별도 데이터가 없습니다 — 필리핀 데이터를 영어 우선으로 봅니다.
 * (docs/VOCAB_PLAN.md §3)
 */
export const vocabSourceCountry = (countryId: CountryId): CountryId =>
  countryId === 'en' ? 'ph' : countryId;

export type VocabPrimary = 'local' | 'en';

export const vocabPrimaryFor = (countryId: CountryId): VocabPrimary =>
  countryId === 'en' ? 'en' : 'local';

export function wordsFor(countryId: CountryId, unitId?: VocabUnitId): VocabWord[] {
  const source = vocabSourceCountry(countryId);
  return VOCAB_WORDS.filter(
    (w) => w.countryId === source && (!unitId || w.unitId === unitId)
  );
}

export function expressionsFor(
  countryId: CountryId,
  unitId?: VocabUnitId
): VocabExpression[] {
  const source = vocabSourceCountry(countryId);
  return VOCAB_EXPRESSIONS.filter(
    (e) => e.countryId === source && (!unitId || e.unitId === unitId)
  );
}

export function dialogsFor(countryId: CountryId, unitId?: VocabUnitId): VocabDialog[] {
  const source = vocabSourceCountry(countryId);
  return VOCAB_DIALOGS.filter(
    (d) => d.countryId === source && (!unitId || d.unitId === unitId)
  );
}

/** 단원 하나에 들어 있는 모든 학습 항목 (단어 → 짧은 말 → 대화 순). */
export function unitItems(countryId: CountryId, unitId: VocabUnitId): VocabItem[] {
  return [
    ...wordsFor(countryId, unitId),
    ...expressionsFor(countryId, unitId),
    ...dialogsFor(countryId, unitId).flatMap(dialogLineItems),
  ];
}

/** id 로 항목을 찾습니다. 보관함이 저장된 id 를 되살릴 때 씁니다. */
export function vocabItemById(id: string): VocabItem | undefined {
  const word = VOCAB_WORDS.find((w) => w.id === id);
  if (word) return word;
  const expression = VOCAB_EXPRESSIONS.find((e) => e.id === id);
  if (expression) return expression;
  for (const dialog of VOCAB_DIALOGS) {
    const line = dialogLineItems(dialog).find((l) => l.id === id);
    if (line) return line;
  }
  return undefined;
}

export const vocabUnitById = (unitId: string) => VOCAB_UNITS.find((u) => u.id === unitId);

/* ------------------------------------------------------------------ */
/* 진행률                                                              */
/* ------------------------------------------------------------------ */

/**
 * 단원 진행률.
 * 한 번이라도 본(뒤집거나 들은) 항목 수 / 단원 전체 항목 수.
 */
export function unitProgress(
  countryId: CountryId,
  unitId: VocabUnitId,
  progress: VocabProgressMap = getVocabProgress()
): { seen: number; total: number } {
  const items = unitItems(countryId, unitId);
  const seen = items.filter((item) => (progress[item.id]?.seen ?? 0) > 0).length;
  return { seen, total: items.length };
}

/* ------------------------------------------------------------------ */
/* 복습 순서                                                            */
/* ------------------------------------------------------------------ */

/**
 * 다음 복습 세트를 고릅니다.
 *   1) 틀린 횟수가 많은 것 먼저 — "몰라요" 한 것이 다시 나와야 복습입니다.
 *   2) 그다음 오래 안 본 것 (한 번도 안 본 것은 lastAt 0 이라 맨 앞).
 *   3) 나머지는 무작위 — 매번 같은 순서면 순서를 외워버립니다.
 */
export function nextQuizSet(
  saved: string[],
  progress: VocabProgressMap,
  n = 10
): string[] {
  return saved
    .map((id) => {
      const record = progress[id];
      return {
        id,
        wrong: record?.wrong ?? 0,
        lastAt: record?.lastAt ?? 0,
        shuffle: Math.random(),
      };
    })
    .sort(
      (a, b) => b.wrong - a.wrong || a.lastAt - b.lastAt || a.shuffle - b.shuffle
    )
    .slice(0, n)
    .map((entry) => entry.id);
}

/* ------------------------------------------------------------------ */
/* 표시 · 재생용 변환                                                    */
/* ------------------------------------------------------------------ */

/** 데이터에 이미 대괄호가 있으면 두 번 씌우지 않습니다. */
export const withBrackets = (pronunciation: string): string => {
  const text = pronunciation.trim();
  if (!text) return '';
  return text.startsWith('[') ? text : `[${text}]`;
};

const stripBrackets = (pronunciation: string): string =>
  pronunciation.trim().replace(/^\[/, '').replace(/\]$/, '');

const itemText = (item: VocabItem) => (isVocabWord(item) ? item.word : item.text);
const itemTextEn = (item: VocabItem) => (isVocabWord(item) ? item.wordEn : item.textEn);

export interface VocabDisplay {
  /** 크게 보여줄 원문 */
  text: string;
  /** 크게 보여줄 한글 발음 (대괄호 포함) */
  pronunciation: string;
  /** 작게 아래 붙는 병기 (필리핀=영어, 영어 트랙=타갈로그). 없으면 undefined */
  subText?: string;
  subPronunciation?: string;
}

/**
 * 나라에 맞춰 무엇을 크게 보여줄지 정합니다.
 *   ph → 타갈로그 크게 + 영어 작게
 *   en → 영어 크게 + 타갈로그 작게 (같은 데이터를 뒤집어 봅니다)
 *   vn → 베트남어만
 */
export function vocabDisplay(item: VocabItem, countryId: CountryId): VocabDisplay {
  const local = itemText(item);
  const localPron = withBrackets(item.pronunciation);
  const en = itemTextEn(item);
  const enPron = item.pronunciationEn ? withBrackets(item.pronunciationEn) : undefined;

  if (vocabPrimaryFor(countryId) === 'en' && en) {
    return {
      text: en,
      pronunciation: enPron ?? localPron,
      subText: local,
      subPronunciation: localPron,
    };
  }
  return {
    text: local,
    pronunciation: localPron,
    subText: en,
    subPronunciation: enPron,
  };
}

/**
 * 어휘 항목을 Phrase 로 바꿉니다 — `playPhrase` 와 `BillboardModal` 재사용용.
 *
 * 같은 내용의 기존 문장(`phraseId`)이 있으면 그 Phrase 를 그대로 돌려줍니다.
 * 그래야 이미 만들어 둔 녹음 오디오가 쓰이고 전광판 문구도 검수된 것으로 나갑니다.
 */
export function vocabAsPhrase(item: VocabItem, primary: VocabPrimary = 'local'): Phrase {
  if (!isVocabWord(item) && item.phraseId) {
    const existing = PHRASES.find((p) => p.id === item.phraseId);
    if (existing) return existing;
  }

  const unit = vocabUnitById(item.unitId);
  const en = itemTextEn(item);
  const useEn = primary === 'en' && Boolean(en);

  return {
    // ph 단어의 영어 음성은 `{id}-en` 키로 따로 생성됩니다 (§4).
    id: useEn ? `${item.id}-en` : item.id,
    countryId: useEn ? 'en' : item.countryId,
    category: unit?.category ?? '전체',
    original: useEn ? (en as string) : itemText(item),
    translation: item.meaning,
    pronunciation: stripBrackets(
      useEn ? item.pronunciationEn ?? item.pronunciation : item.pronunciation
    ),
    usageTip: isVocabWord(item) ? item.tip : undefined,
  };
}
