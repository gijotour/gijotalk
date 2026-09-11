import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { VocabExpression, VocabDialog, VocabWord } from '../types';
import { PHRASES } from '../config';
import {
  VOCAB_SAVED_KEY,
  VOCAB_PROGRESS_KEY,
  VOCAB_UNIT_DONE_KEY,
  getSavedVocabIds,
  saveVocabIds,
  toggleVocabId,
  getVocabProgress,
  saveVocabProgress,
  recordSeen,
  recordAnswer,
  unitStampId,
  getUnitDoneIds,
  markUnitDone,
  dialogLineItems,
  vocabSourceCountry,
  vocabPrimaryFor,
  wordsFor,
  expressionsFor,
  unitItems,
  vocabItemById,
  unitProgress,
  nextQuizSet,
  withBrackets,
  vocabDisplay,
  vocabAsPhrase,
} from './vocab';

const word = (over: Partial<VocabWord> = {}): VocabWord => ({
  id: 'vw-ph-hotel-99',
  countryId: 'ph',
  unitId: 'hotel',
  emoji: '🔑',
  word: 'susi',
  wordEn: 'key',
  meaning: '열쇠',
  pronunciation: '[수시]',
  pronunciationEn: '[키]',
  ...over,
});

const expression = (over: Partial<VocabExpression> = {}): VocabExpression => ({
  id: 've-ph-hotel-99',
  countryId: 'ph',
  unitId: 'hotel',
  text: 'Susi po.',
  textEn: 'Key, please.',
  meaning: '열쇠 주세요.',
  pronunciation: '[수시 포]',
  pronunciationEn: '[키 플리즈]',
  wordIds: ['vw-ph-hotel-99'],
  ...over,
});

const dialog = (): VocabDialog => ({
  id: 'vd-ph-hotel',
  countryId: 'ph',
  unitId: 'hotel',
  title: '체크인 하기',
  lines: [
    { speaker: 'me', text: 'Check in po.', meaning: '체크인 할게요.', pronunciation: '[체크 인 포]' },
    { speaker: 'them', text: 'Pangalan po?', meaning: '성함이요?', pronunciation: '[팡알란 포]' },
  ],
});

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('저장 목록', () => {
  it('저장한 것이 없으면 빈 배열이다', () => {
    expect(getSavedVocabIds()).toEqual([]);
  });

  it('저장하고 다시 읽으면 같은 목록이 나온다', () => {
    saveVocabIds(['a', 'b']);
    expect(getSavedVocabIds()).toEqual(['a', 'b']);
    expect(localStorage.getItem(VOCAB_SAVED_KEY)).toBe('["a","b"]');
  });

  it('토글은 넣고 빼고를 뒤집으며 저장까지 한다', () => {
    const added = toggleVocabId('a', []);
    expect(added).toEqual(['a']);
    expect(getSavedVocabIds()).toEqual(['a']);

    const removed = toggleVocabId('a', added);
    expect(removed).toEqual([]);
    expect(getSavedVocabIds()).toEqual([]);
  });

  it('깨진 값이 들어 있어도 빈 배열로 버틴다', () => {
    localStorage.setItem(VOCAB_SAVED_KEY, '{oops');
    expect(getSavedVocabIds()).toEqual([]);

    localStorage.setItem(VOCAB_SAVED_KEY, '{"a":1}');
    expect(getSavedVocabIds()).toEqual([]);

    localStorage.setItem(VOCAB_SAVED_KEY, '["a",3,null,"b"]');
    expect(getSavedVocabIds()).toEqual(['a', 'b']);
  });
});

describe('진행 기록', () => {
  it('기록이 없으면 빈 객체다', () => {
    expect(getVocabProgress()).toEqual({});
  });

  it('본 횟수를 올리고 마지막 시각을 남긴다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-11T00:00:00Z'));

    const first = recordSeen('vw-1', {});
    expect(first['vw-1'].seen).toBe(1);
    expect(first['vw-1'].lastAt).toBe(Date.now());

    const second = recordSeen('vw-1', first);
    expect(second['vw-1'].seen).toBe(2);
    // 저장까지 됐는지 — 새로고침하면 사라지는 진행률은 진행률이 아닙니다.
    expect(getVocabProgress()['vw-1'].seen).toBe(2);
  });

  it('정답과 오답을 따로 센다', () => {
    let progress = recordAnswer('vw-1', true, {});
    progress = recordAnswer('vw-1', false, progress);
    progress = recordAnswer('vw-1', false, progress);

    expect(progress['vw-1'].correct).toBe(1);
    expect(progress['vw-1'].wrong).toBe(2);
    expect(progress['vw-1'].seen).toBe(3);
  });

  it('원본 객체를 건드리지 않는다 (React 상태로 쓰므로)', () => {
    const before = { 'vw-1': { seen: 1, correct: 0, wrong: 0, lastAt: 1 } };
    const after = recordSeen('vw-1', before);
    expect(before['vw-1'].seen).toBe(1);
    expect(after).not.toBe(before);
  });

  it('깨진 기록은 0 으로 정리해서 읽는다', () => {
    localStorage.setItem(
      VOCAB_PROGRESS_KEY,
      JSON.stringify({ ok: { seen: 2, correct: 1, wrong: 1, lastAt: 5 }, bad: 'nope', worse: { seen: 'x' } })
    );
    const progress = getVocabProgress();
    expect(progress.ok).toEqual({ seen: 2, correct: 1, wrong: 1, lastAt: 5 });
    expect(progress.bad).toBeUndefined();
    expect(progress.worse).toEqual({ seen: 0, correct: 0, wrong: 0, lastAt: 0 });
  });

  it('배열이나 깨진 JSON 이면 빈 객체다', () => {
    localStorage.setItem(VOCAB_PROGRESS_KEY, '[1,2]');
    expect(getVocabProgress()).toEqual({});
    localStorage.setItem(VOCAB_PROGRESS_KEY, 'nope');
    expect(getVocabProgress()).toEqual({});
  });

  it('저장한 진행 기록을 그대로 다시 읽는다', () => {
    saveVocabProgress({ a: { seen: 1, correct: 1, wrong: 0, lastAt: 9 } });
    expect(getVocabProgress()).toEqual({ a: { seen: 1, correct: 1, wrong: 0, lastAt: 9 } });
  });
});

describe('단원 도장', () => {
  it('나라별로 따로 찍힌다', () => {
    expect(unitStampId('ph', 'hotel')).toBe('ph:hotel');
    expect(unitStampId('vn', 'hotel')).toBe('vn:hotel');
  });

  it('같은 도장을 두 번 찍어도 하나만 남는다', () => {
    const once = markUnitDone('ph:hotel', []);
    const twice = markUnitDone('ph:hotel', once);
    expect(twice).toEqual(['ph:hotel']);
    expect(twice).toBe(once);
    expect(getUnitDoneIds()).toEqual(['ph:hotel']);
  });

  it('다른 단원은 덧붙는다', () => {
    const list = markUnitDone('ph:airport', markUnitDone('ph:hotel', []));
    expect(list).toEqual(['ph:hotel', 'ph:airport']);
    expect(localStorage.getItem(VOCAB_UNIT_DONE_KEY)).toBe('["ph:hotel","ph:airport"]');
  });
});

describe('데이터 조회', () => {
  it('영어 트랙은 필리핀 데이터를 영어 우선으로 본다', () => {
    expect(vocabSourceCountry('en')).toBe('ph');
    expect(vocabSourceCountry('vn')).toBe('vn');
    expect(vocabPrimaryFor('en')).toBe('en');
    expect(vocabPrimaryFor('ph')).toBe('local');
  });

  it('en 으로 조회하면 ph 단어가 나온다', () => {
    const en = wordsFor('en');
    const ph = wordsFor('ph');
    expect(en).toEqual(ph);
    expect(en.every((w) => w.countryId === 'ph')).toBe(true);
  });

  it('단원으로 좁힐 수 있다', () => {
    const all = wordsFor('ph');
    const hotel = wordsFor('ph', 'hotel');
    expect(hotel.every((w) => w.unitId === 'hotel')).toBe(true);
    expect(hotel.length).toBeLessThanOrEqual(all.length);
    expect(expressionsFor('ph', 'hotel').every((e) => e.unitId === 'hotel')).toBe(true);
  });

  it('대화 줄에는 오디오 키와 같은 합성 id 가 붙는다', () => {
    const lines = dialogLineItems(dialog());
    expect(lines.map((l) => l.id)).toEqual(['vd-ph-hotel-L1', 'vd-ph-hotel-L2']);
    expect(lines[0].unitId).toBe('hotel');
    expect(lines[1].lineNo).toBe(2);
  });

  it('단원 항목은 단어 → 짧은 말 → 대화 순이다', () => {
    const items = unitItems('ph', 'hotel');
    const words = wordsFor('ph', 'hotel');
    expect(items.slice(0, words.length)).toEqual(words);
  });

  it('없는 id 를 찾으면 undefined 다', () => {
    expect(vocabItemById('없는-id')).toBeUndefined();
  });

  it('있는 id 는 되살아난다', () => {
    const first = wordsFor('ph')[0];
    expect(vocabItemById(first.id)).toEqual(first);
  });
});

describe('단원 진행률', () => {
  it('아무것도 안 봤으면 0 이다', () => {
    const { seen, total } = unitProgress('ph', 'hotel', {});
    expect(seen).toBe(0);
    expect(total).toBe(unitItems('ph', 'hotel').length);
  });

  it('본 항목만 센다', () => {
    const items = unitItems('ph', 'hotel');
    const progress = recordSeen(items[0].id, {});
    expect(unitProgress('ph', 'hotel', progress).seen).toBe(1);
  });

  it('인자를 생략하면 저장소에서 읽는다', () => {
    const items = unitItems('ph', 'hotel');
    saveVocabProgress(recordSeen(items[0].id, {}));
    expect(unitProgress('ph', 'hotel').seen).toBe(1);
  });
});

describe('복습 순서', () => {
  it('틀린 횟수가 많은 것이 먼저 나온다', () => {
    const progress = {
      a: { seen: 3, correct: 3, wrong: 0, lastAt: 100 },
      b: { seen: 3, correct: 0, wrong: 3, lastAt: 100 },
      c: { seen: 3, correct: 2, wrong: 1, lastAt: 100 },
    };
    expect(nextQuizSet(['a', 'b', 'c'], progress)).toEqual(['b', 'c', 'a']);
  });

  it('틀린 횟수가 같으면 오래 안 본 것이 먼저다', () => {
    const progress = {
      a: { seen: 1, correct: 1, wrong: 0, lastAt: 300 },
      b: { seen: 1, correct: 1, wrong: 0, lastAt: 100 },
      c: { seen: 1, correct: 1, wrong: 0, lastAt: 200 },
    };
    expect(nextQuizSet(['a', 'b', 'c'], progress)).toEqual(['b', 'c', 'a']);
  });

  it('한 번도 안 본 것이 맨 앞에 온다', () => {
    const progress = { a: { seen: 1, correct: 1, wrong: 0, lastAt: 100 } };
    expect(nextQuizSet(['a', 'new'], progress)[0]).toBe('new');
  });

  it('기본 10문제까지만 자른다', () => {
    const ids = Array.from({ length: 25 }, (_, i) => `id-${i}`);
    expect(nextQuizSet(ids, {})).toHaveLength(10);
    expect(nextQuizSet(ids, {}, 3)).toHaveLength(3);
  });

  it('개수가 모자라면 있는 만큼만 준다', () => {
    expect(nextQuizSet(['a', 'b'], {})).toHaveLength(2);
    expect(nextQuizSet([], {})).toEqual([]);
  });

  it('같은 조건이면 순서를 섞되 항목을 잃지 않는다', () => {
    const ids = ['a', 'b', 'c', 'd'];
    expect([...nextQuizSet(ids, {}, 4)].sort()).toEqual(ids);
  });
});

describe('표시 변환', () => {
  it('대괄호를 두 번 씌우지 않는다', () => {
    expect(withBrackets('[수시]')).toBe('[수시]');
    expect(withBrackets('수시')).toBe('[수시]');
    expect(withBrackets('  ')).toBe('');
  });

  it('필리핀은 타갈로그가 크고 영어가 작다', () => {
    const display = vocabDisplay(word(), 'ph');
    expect(display.text).toBe('susi');
    expect(display.pronunciation).toBe('[수시]');
    expect(display.subText).toBe('key');
  });

  it('영어 트랙은 영어가 크고 타갈로그가 작다', () => {
    const display = vocabDisplay(word(), 'en');
    expect(display.text).toBe('key');
    expect(display.pronunciation).toBe('[키]');
    expect(display.subText).toBe('susi');
  });

  it('베트남은 병기가 없다', () => {
    const vn = word({ id: 'vw-vn-hotel-01', countryId: 'vn', word: 'chìa khóa', wordEn: undefined, pronunciationEn: undefined, pronunciation: '[찌아 코아]' });
    const display = vocabDisplay(vn, 'vn');
    expect(display.text).toBe('chìa khóa');
    expect(display.subText).toBeUndefined();
  });

  it('영어 병기가 없는데 영어 트랙이면 현지어로 떨어진다', () => {
    const vn = word({ countryId: 'vn', wordEn: undefined, pronunciationEn: undefined });
    expect(vocabDisplay(vn, 'en').text).toBe('susi');
  });
});

describe('vocabAsPhrase — 기존 재생·전광판 재사용', () => {
  it('단어를 Phrase 로 바꾼다 (발음에서 대괄호를 뺀다)', () => {
    const phrase = vocabAsPhrase(word());
    expect(phrase.id).toBe('vw-ph-hotel-99');
    expect(phrase.countryId).toBe('ph');
    expect(phrase.original).toBe('susi');
    expect(phrase.translation).toBe('열쇠');
    // PhraseCard 가 [ ] 를 직접 붙입니다. 여기서 붙이면 [[수시]] 가 됩니다.
    expect(phrase.pronunciation).toBe('수시');
    expect(phrase.category).toBe('호텔');
  });

  it('영어 우선이면 영어 원문과 -en 오디오 키를 쓴다', () => {
    const phrase = vocabAsPhrase(word(), 'en');
    expect(phrase.id).toBe('vw-ph-hotel-99-en');
    expect(phrase.countryId).toBe('en');
    expect(phrase.original).toBe('key');
    expect(phrase.pronunciation).toBe('키');
  });

  it('단어의 tip 은 사용 팁으로 넘어간다', () => {
    expect(vocabAsPhrase(word({ tip: '존댓말 po 를 붙이세요' })).usageTip).toBe(
      '존댓말 po 를 붙이세요'
    );
  });

  it('phraseId 가 있으면 기존 문장을 그대로 쓴다 (녹음 오디오 재사용)', () => {
    const existing = PHRASES[0];
    const phrase = vocabAsPhrase(expression({ phraseId: existing.id }));
    expect(phrase).toBe(existing);
  });

  it('phraseId 가 가리키는 문장이 없으면 어휘 데이터로 만든다', () => {
    const phrase = vocabAsPhrase(expression({ phraseId: '없는-문장' }));
    expect(phrase.id).toBe('ve-ph-hotel-99');
    expect(phrase.original).toBe('Susi po.');
  });

  it('대화 한 줄도 Phrase 가 된다', () => {
    const line = dialogLineItems(dialog())[0];
    const phrase = vocabAsPhrase(line);
    expect(phrase.id).toBe('vd-ph-hotel-L1');
    expect(phrase.original).toBe('Check in po.');
    expect(phrase.translation).toBe('체크인 할게요.');
  });
});
