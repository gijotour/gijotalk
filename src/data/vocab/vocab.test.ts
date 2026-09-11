import { describe, it, expect } from 'vitest';
import { VOCAB_UNITS, VOCAB_WORDS, VOCAB_EXPRESSIONS, VOCAB_DIALOGS } from './index';
import { PHRASES } from '../../config';
import type { CountryId, VocabUnitId } from '../../types';

/**
 * 어휘 데이터의 "모양" 을 지키는 테스트입니다.
 *
 * 화면은 단원마다 단어 12장 · 짧은 말 6개 · 대화 1개(4줄)를 그대로 그립니다.
 * 하나라도 개수가 틀리면 진행률 바와 도장이 어긋나므로 여기서 막습니다.
 * 설계: docs/VOCAB_PLAN.md
 */

const COUNTRY_IDS: CountryId[] = ['ph', 'vn'];
const UNIT_IDS = VOCAB_UNITS.map((u) => u.id);

const PHRASE_BY_ID = new Map(PHRASES.map((p) => [p.id, p]));
const WORD_BY_ID = new Map(VOCAB_WORDS.map((w) => [w.id, w]));

/** 공백으로 끊은 낱말 수. 원문(현지어)만 셉니다 — 영어 병기는 길이 제한 밖입니다. */
const tokens = (text: string) => text.trim().split(/\s+/).length;

/** 이모지는 딱 하나. ZWJ·이형자 선택자가 붙어도 통과하도록 길이로만 봅니다. */
const isSingleEmoji = (emoji: string) => emoji.trim().length > 0 && emoji.length <= 8;

const isBracketed = (pron: string) => pron.startsWith('[') && pron.endsWith(']');

describe('어휘 데이터 — id', () => {
  it('단어·짧은 말·대화 id 가 전부 다르다', () => {
    const ids = [
      ...VOCAB_WORDS.map((w) => w.id),
      ...VOCAB_EXPRESSIONS.map((e) => e.id),
      ...VOCAB_DIALOGS.map((d) => d.id),
    ];
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('id 가 vw-/ve-/vd-{나라}-{단원} 규칙을 따른다', () => {
    for (const w of VOCAB_WORDS) expect(w.id).toMatch(/^vw-(ph|vn)-[a-z]+-\d{2}$/);
    for (const e of VOCAB_EXPRESSIONS) expect(e.id).toMatch(/^ve-(ph|vn)-[a-z]+-\d{2}$/);
    for (const d of VOCAB_DIALOGS) expect(d.id).toMatch(/^vd-(ph|vn)-[a-z]+$/);
    for (const w of VOCAB_WORDS) expect(w.id).toBe(`vw-${w.countryId}-${w.unitId}-${w.id.slice(-2)}`);
    for (const e of VOCAB_EXPRESSIONS) expect(e.id).toBe(`ve-${e.countryId}-${e.unitId}-${e.id.slice(-2)}`);
    for (const d of VOCAB_DIALOGS) expect(d.id).toBe(`vd-${d.countryId}-${d.unitId}`);
  });
});

describe('어휘 데이터 — 단원마다 개수', () => {
  it('단원은 10개이고 순서가 1..10 이다', () => {
    expect(VOCAB_UNITS).toHaveLength(10);
    expect(VOCAB_UNITS.map((u) => u.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(new Set(UNIT_IDS).size).toBe(10);
  });

  for (const countryId of COUNTRY_IDS) {
    for (const unitId of UNIT_IDS) {
      it(`${countryId}/${unitId} 는 단어 12 · 짧은 말 6 · 대화 1 이다`, () => {
        const words = VOCAB_WORDS.filter((w) => w.countryId === countryId && w.unitId === unitId);
        const exprs = VOCAB_EXPRESSIONS.filter((e) => e.countryId === countryId && e.unitId === unitId);
        const dialogs = VOCAB_DIALOGS.filter((d) => d.countryId === countryId && d.unitId === unitId);

        expect(words).toHaveLength(12);
        expect(exprs).toHaveLength(6);
        expect(dialogs).toHaveLength(1);

        // 01 부터 빠짐없이 이어져야 합니다 — 화면의 "3/12" 표시가 여기에 기댑니다.
        expect(words.map((w) => w.id.slice(-2))).toEqual(
          ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        );
        expect(exprs.map((e) => e.id.slice(-2))).toEqual(['01', '02', '03', '04', '05', '06']);
      });
    }
  }

  it('두 나라 합쳐 단어 240 · 짧은 말 120 · 대화 20 이다', () => {
    expect(VOCAB_WORDS).toHaveLength(240);
    expect(VOCAB_EXPRESSIONS).toHaveLength(120);
    expect(VOCAB_DIALOGS).toHaveLength(20);
  });
});

describe('어휘 데이터 — 대화', () => {
  it('모든 대화는 4줄이고 나/상대가 번갈아 나온다', () => {
    for (const dialog of VOCAB_DIALOGS) {
      expect(dialog.lines, dialog.id).toHaveLength(4);
      expect(dialog.title.length, dialog.id).toBeGreaterThan(0);
      dialog.lines.forEach((line, i) => {
        const previous = dialog.lines[i - 1];
        if (previous) expect(line.speaker, `${dialog.id} ${i + 1}번째 줄`).not.toBe(previous.speaker);
      });
    }
  });

  it('대화 한 줄은 6 단어 이하다', () => {
    for (const dialog of VOCAB_DIALOGS) {
      for (const line of dialog.lines) {
        expect(tokens(line.text), `${dialog.id}: ${line.text}`).toBeLessThanOrEqual(6);
        expect(line.meaning.length, `${dialog.id}: ${line.text}`).toBeGreaterThan(0);
        expect(isBracketed(line.pronunciation), `${dialog.id}: ${line.pronunciation}`).toBe(true);
      }
    }
  });
});

describe('어휘 데이터 — 단어', () => {
  it('모든 단어에 이모지 하나와 [한글 발음]이 있다', () => {
    for (const w of VOCAB_WORDS) {
      expect(isSingleEmoji(w.emoji), `${w.id}: ${w.emoji}`).toBe(true);
      expect(isBracketed(w.pronunciation), `${w.id}: ${w.pronunciation}`).toBe(true);
      expect(w.meaning.trim().length, w.id).toBeGreaterThan(0);
      expect(w.word.trim().length, w.id).toBeGreaterThan(0);
    }
  });

  it('단어는 2 낱말 이하다', () => {
    for (const w of VOCAB_WORDS) {
      expect(tokens(w.word), `${w.id}: ${w.word}`).toBeLessThanOrEqual(2);
    }
  });

  it('한 단원 안에서 같은 단어가 겹치지 않는다', () => {
    for (const countryId of COUNTRY_IDS) {
      for (const unitId of UNIT_IDS) {
        const words = VOCAB_WORDS
          .filter((w) => w.countryId === countryId && w.unitId === unitId)
          .map((w) => w.word.toLowerCase());
        expect(new Set(words).size, `${countryId}/${unitId}`).toBe(words.length);
      }
    }
  });
});

describe('어휘 데이터 — 짧은 말', () => {
  it('짧은 말은 5 낱말 이하고 [한글 발음]이 있다', () => {
    for (const e of VOCAB_EXPRESSIONS) {
      expect(tokens(e.text), `${e.id}: ${e.text}`).toBeLessThanOrEqual(5);
      expect(tokens(e.text), `${e.id}: ${e.text}`).toBeGreaterThanOrEqual(2);
      expect(isBracketed(e.pronunciation), `${e.id}: ${e.pronunciation}`).toBe(true);
      expect(e.meaning.trim().length, e.id).toBeGreaterThan(0);
    }
  });

  it('wordIds 가 같은 나라·같은 단원의 실제 단어를 가리킨다', () => {
    for (const e of VOCAB_EXPRESSIONS) {
      expect(e.wordIds.length, e.id).toBeGreaterThanOrEqual(1);
      for (const wordId of e.wordIds) {
        const word = WORD_BY_ID.get(wordId);
        expect(word, `${e.id} → ${wordId} 가 없습니다`).toBeDefined();
        expect(word!.countryId, `${e.id} → ${wordId}`).toBe(e.countryId);
        expect(word!.unitId, `${e.id} → ${wordId}`).toBe(e.unitId);
      }
    }
  });
});

describe('어휘 데이터 — 기존 문장 연결(phraseId)', () => {
  const linked = [
    ...VOCAB_EXPRESSIONS.map((e) => ({ id: e.id, countryId: e.countryId, phraseId: e.phraseId, text: e.text })),
    ...VOCAB_DIALOGS.flatMap((d) =>
      d.lines.map((line, i) => ({
        id: `${d.id}-L${i + 1}`,
        countryId: d.countryId,
        phraseId: line.phraseId,
        text: line.text,
      }))
    ),
  ].filter((item): item is typeof item & { phraseId: string } => Boolean(item.phraseId));

  it('phraseId 가 실제 문장이고 나라가 같다', () => {
    for (const item of linked) {
      const phrase = PHRASE_BY_ID.get(item.phraseId);
      expect(phrase, `${item.id} → ${item.phraseId} 가 PHRASES 에 없습니다`).toBeDefined();
      expect(phrase!.countryId, `${item.id} → ${item.phraseId}`).toBe(item.countryId);
    }
  });

  it('연결한 문장은 원문이 똑같다 — 그래야 녹음된 소리가 맞습니다', () => {
    for (const item of linked) {
      expect(PHRASE_BY_ID.get(item.phraseId)!.original, item.id).toBe(item.text);
    }
  });
});

describe('어휘 데이터 — 나라별 영어 병기 규칙', () => {
  it('필리핀 항목에는 영어와 영어 발음이 모두 있다', () => {
    for (const w of VOCAB_WORDS.filter((x) => x.countryId === 'ph')) {
      expect(w.wordEn?.trim(), w.id).toBeTruthy();
      expect(isBracketed(w.pronunciationEn ?? ''), `${w.id}: ${w.pronunciationEn}`).toBe(true);
    }
    for (const e of VOCAB_EXPRESSIONS.filter((x) => x.countryId === 'ph')) {
      expect(e.textEn?.trim(), e.id).toBeTruthy();
      expect(isBracketed(e.pronunciationEn ?? ''), `${e.id}: ${e.pronunciationEn}`).toBe(true);
    }
    for (const d of VOCAB_DIALOGS.filter((x) => x.countryId === 'ph')) {
      for (const line of d.lines) {
        expect(line.textEn?.trim(), `${d.id}: ${line.text}`).toBeTruthy();
        expect(isBracketed(line.pronunciationEn ?? ''), `${d.id}: ${line.pronunciationEn}`).toBe(true);
      }
    }
  });

  it('베트남 항목에는 영어 병기가 없다', () => {
    for (const w of VOCAB_WORDS.filter((x) => x.countryId === 'vn')) {
      expect(w.wordEn, w.id).toBeUndefined();
      expect(w.pronunciationEn, w.id).toBeUndefined();
    }
    for (const e of VOCAB_EXPRESSIONS.filter((x) => x.countryId === 'vn')) {
      expect(e.textEn, e.id).toBeUndefined();
      expect(e.pronunciationEn, e.id).toBeUndefined();
    }
    for (const d of VOCAB_DIALOGS.filter((x) => x.countryId === 'vn')) {
      for (const line of d.lines) {
        expect(line.textEn, `${d.id}: ${line.text}`).toBeUndefined();
        expect(line.pronunciationEn, `${d.id}: ${line.text}`).toBeUndefined();
      }
    }
  });

  it('단원 id 는 units.ts 에 있는 것만 쓴다', () => {
    const known = new Set<VocabUnitId>(UNIT_IDS);
    for (const w of VOCAB_WORDS) expect(known.has(w.unitId), w.id).toBe(true);
    for (const e of VOCAB_EXPRESSIONS) expect(known.has(e.unitId), e.id).toBe(true);
    for (const d of VOCAB_DIALOGS) expect(known.has(d.unitId), d.id).toBe(true);
  });
});
