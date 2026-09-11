import { describe, it, expect } from 'vitest';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { PASSCODE_HASH, UNLOCK_STORAGE_KEY } from '../../utils/appLock';
import { VOCAB_UNITS } from '../../data/vocab';
import {
  expressionsFor,
  withBrackets,
  wordsFor,
  VOCAB_SAVED_KEY,
} from '../../utils/vocab';

/**
 * 배우기 탭 — 앱을 통째로 띄워서 봅니다.
 *
 * 어휘 데이터는 다른 에이전트가 계속 채우는 중이라, 특정 단어("susi")를
 * 테스트에 박으면 데이터가 바뀔 때마다 깨집니다. 그래서 단어 내용은
 * `wordsFor()` 로 데이터에서 직접 가져와 비교합니다.
 */
const renderApp = async () => {
  localStorage.setItem(UNLOCK_STORAGE_KEY, PASSCODE_HASH);
  const result = render(<App />);
  await act(async () => {});
  return result;
};

/** 샘플 데이터가 확실히 들어 있는 단원으로 들어갑니다. */
const HOTEL = VOCAB_UNITS.find((u) => u.id === 'hotel')!;

const openHotelUnit = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: `${HOTEL.title} 단원 열기` }));
};

describe('배우기 탭', () => {
  it('앱을 열면 배우기가 먼저 나오고 단원 10개가 보인다', async () => {
    await renderApp();

    const units = screen.getAllByRole('button', { name: /단원 열기$/ });
    expect(units).toHaveLength(VOCAB_UNITS.length);
    expect(units).toHaveLength(10);
    // 단원 목록이 먼저라면 회화 검색창은 아직 없어야 합니다.
    expect(screen.queryByLabelText('회화 검색')).not.toBeInTheDocument();
  });

  it('단원을 열면 단어 카드가 한 장 나온다', async () => {
    const user = userEvent.setup();
    await renderApp();
    await openHotelUnit(user);

    const first = wordsFor('ph', 'hotel')[0];
    expect(screen.getByText(withBrackets(first.pronunciation))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '단어 카드 뒤집기' })).toBeInTheDocument();
    // "1 / 12" 처럼 몇 장 중 몇 번째인지 항상 보입니다.
    expect(
      screen.getByText(`1 / ${wordsFor('ph', 'hotel').length}`)
    ).toBeInTheDocument();
  });

  it('앞면에는 뜻이 없고 뒤집어야 나온다', async () => {
    const user = userEvent.setup();
    await renderApp();
    await openHotelUnit(user);

    const first = wordsFor('ph', 'hotel')[0];
    // 앞면에 뜻이 같이 보이면 발음을 읽지 않고 뜻만 읽습니다 — 카드가 아니라 목록이 됩니다.
    expect(screen.queryByText(first.meaning)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '단어 카드 뒤집기' }));
    expect(screen.getByText(first.meaning)).toBeInTheDocument();
  });

  it('다음 단어로 넘어가면 다른 카드가 나온다', async () => {
    const user = userEvent.setup();
    await renderApp();
    await openHotelUnit(user);

    const words = wordsFor('ph', 'hotel');
    if (words.length < 2) return; // 데이터가 아직 1개뿐이면 볼 것이 없습니다

    await user.click(screen.getByRole('button', { name: '다음 단어' }));
    expect(screen.getByText(withBrackets(words[1].pronunciation))).toBeInTheDocument();
    expect(screen.getByText(`2 / ${words.length}`)).toBeInTheDocument();
  });

  it('★ 로 담으면 보관함 뱃지와 내 단어장에 나타난다', async () => {
    const user = userEvent.setup();
    await renderApp();
    await openHotelUnit(user);

    const first = wordsFor('ph', 'hotel')[0];
    await user.click(screen.getByRole('button', { name: '단어 저장' }));

    // 저장 키에 바로 남아야 합니다 — 앱을 껐다 켜도 살아 있어야 하는 값입니다.
    expect(JSON.parse(localStorage.getItem(VOCAB_SAVED_KEY) ?? '[]')).toEqual([first.id]);
    expect(screen.getByRole('button', { name: '단어 저장 취소' })).toBeInTheDocument();

    const nav = screen.getByRole('navigation', { name: '주요 메뉴' });
    expect(within(nav).getByText('1')).toBeInTheDocument();

    await user.click(within(nav).getByRole('button', { name: /보관함/ }));
    const shelf = screen.getByRole('region', { name: '내 단어장' });
    expect(within(shelf).getByText('내 단어장 (1)')).toBeInTheDocument();
    expect(within(shelf).getByText(first.meaning)).toBeInTheDocument();

    // 기존 문장 보관함은 그대로 아래에 남아 있어야 합니다.
    expect(screen.getByText(/아직 저장된 문장이 없습니다/)).toBeInTheDocument();
  });

  it('단원의 모든 단계를 보면 도장이 찍힌다', async () => {
    const user = userEvent.setup();
    await renderApp();
    await openHotelUnit(user);

    for (const label of ['단어 단계', '짧은 말 단계', '대화 단계']) {
      const button = screen.getByRole('button', { name: label });
      if (!button.hasAttribute('disabled')) await user.click(button);
    }

    expect(screen.getByText('다 배웠어요 🎉')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '단원 목록으로' }));
    // 목록으로 돌아오면 그 단원에 도장이 붙어 있습니다.
    const card = screen.getByRole('button', { name: `${HOTEL.title} 단원 열기` });
    expect(within(card).getByText('다 배웠어요 🎉')).toBeInTheDocument();
  });

  it('짧은 말 단계에서 전광판을 바로 열 수 있다', async () => {
    const user = userEvent.setup();
    await renderApp();
    await openHotelUnit(user);

    if (expressionsFor('ph', 'hotel').length === 0) return;

    await user.click(screen.getByRole('button', { name: '짧은 말 단계' }));
    await user.click(screen.getAllByRole('button', { name: '전광판으로 크게 보기' })[0]);
    expect(screen.getByRole('dialog', { name: /긴급 전광판/ })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('복습 퀴즈', () => {
  it('보관함에서 열어 한 문제를 풀 수 있다', async () => {
    const user = userEvent.setup();
    await renderApp();

    const nav = screen.getByRole('navigation', { name: '주요 메뉴' });
    await user.click(within(nav).getByRole('button', { name: /보관함/ }));
    await user.click(screen.getByRole('button', { name: '복습하기' }));

    const quiz = screen.getByRole('region', { name: '복습 퀴즈' });
    // 담은 게 없으면 이 나라 단어 전체로 연습한다고 알려줍니다.
    expect(within(quiz).getByText(/단어 전체로 연습해요/)).toBeInTheDocument();
    expect(within(quiz).getByText(/^1 \/ \d+ 문제$/)).toBeInTheDocument();

    // 첫 문제는 4지선다 — 보기를 하나 고르면 채점하고 다음으로 갈 수 있습니다.
    const options = within(quiz).getAllByRole('listitem');
    await user.click(within(options[0]).getByRole('button'));

    expect(
      within(quiz).getByRole('button', { name: /다음 문제|결과 보기/ })
    ).toBeInTheDocument();
  });

  it('퀴즈를 닫으면 단어장으로 돌아온다', async () => {
    const user = userEvent.setup();
    await renderApp();

    const nav = screen.getByRole('navigation', { name: '주요 메뉴' });
    await user.click(within(nav).getByRole('button', { name: /보관함/ }));
    await user.click(screen.getByRole('button', { name: '복습하기' }));
    await user.click(screen.getByRole('button', { name: '퀴즈 닫기' }));

    expect(screen.queryByRole('region', { name: '복습 퀴즈' })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: '내 단어장' })).toBeInTheDocument();
  });
});
