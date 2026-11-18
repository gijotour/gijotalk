import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { PASSCODE_HASH, UNLOCK_STORAGE_KEY } from '../../utils/appLock';
import { SCENARIOS, scenarioLineAsPhrase, scenariosFor } from '../../data/scenarios';

const renderApp = async () => {
  localStorage.setItem(UNLOCK_STORAGE_KEY, PASSCODE_HASH);
  const result = render(<App />);
  await act(async () => {});
  return result;
};

describe('만남 대화 시나리오', () => {
  it('앱을 열면 만남 대화가 메인으로 열리고 필리핀어(타갈로그) 최소 단어로 3턴 대화를 완료한다', async () => {
    const user = userEvent.setup();
    await renderApp();

    // 만남 대화가 기본 메인 화면입니다.
    expect(screen.getByRole('tab', { name: '만남 대화' })).toHaveAttribute('aria-selected', 'true');

    const list = scenariosFor('ph');
    expect(list).toHaveLength(5);
    const cafe = list[0];

    await user.click(screen.getByRole('button', { name: `${cafe.title} 대화 시작` }));
    expect(screen.getByText(`[${cafe.turns[0].partner.pronunciation}]`)).toBeInTheDocument();
    expect(screen.getByText(cafe.turns[0].partner.text)).toBeInTheDocument();

    for (let i = 0; i < cafe.turns.length; i++) {
      const choice = cafe.turns[i].choices[0];
      await user.click(screen.getByText(`[${choice.pronunciation}]`));
      await act(async () => {
        await new Promise((r) => setTimeout(r, 620));
      });
      expect(screen.getByText(`[${choice.partnerReply.pronunciation}]`)).toBeInTheDocument();
    }

    expect(screen.getByText(/대화를 마쳤어요/)).toBeInTheDocument();
  });

  it('내 말풍선의 전광판 버튼으로 긴급 전광판 모달을 열 수 있다', async () => {
    const user = userEvent.setup();
    await renderApp();

    const cafe = scenariosFor('ph')[0];
    await user.click(screen.getByRole('button', { name: `${cafe.title} 대화 시작` }));

    const choice = cafe.turns[0].choices[0];
    await user.click(screen.getByText(`[${choice.pronunciation}]`));

    await user.click(screen.getByRole('button', { name: `${choice.meaning} 크게 보여주기` }));
    expect(screen.getByRole('dialog', { name: /긴급 전광판/ })).toBeInTheDocument();
  });

  it('필리핀어(ph)·영어(en)·베트남어(vn) 모든 대사가 4단어 이하 최소 단어이고 각 언어 음성 코드로 매핑된다', () => {
    for (const countryId of ['ph', 'en', 'vn'] as const) {
      const list = scenariosFor(countryId);
      expect(list).toHaveLength(5);
      for (const sc of list) {
        expect(sc.turns).toHaveLength(3);
        for (const turn of sc.turns) {
          expect(turn.partner.text.trim().split(/\s+/).length).toBeLessThanOrEqual(4);
          expect(scenarioLineAsPhrase(turn.partner, countryId).countryId).toBe(countryId);
          for (const ch of turn.choices) {
            expect(ch.text.trim().split(/\s+/).length).toBeLessThanOrEqual(4);
            expect(ch.partnerReply.text.trim().split(/\s+/).length).toBeLessThanOrEqual(4);
          }
        }
      }
    }
    expect(SCENARIOS).toHaveLength(15);
  });
});
