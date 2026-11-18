import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { PASSCODE_HASH, UNLOCK_STORAGE_KEY } from '../../utils/appLock';
import { scenariosFor } from '../../data/scenarios';

const renderApp = async () => {
  localStorage.setItem(UNLOCK_STORAGE_KEY, PASSCODE_HASH);
  const result = render(<App />);
  await act(async () => {});
  return result;
};

describe('만남 대화 시나리오', () => {
  it('배우기 안 만남 대화 탭에서 상대방 말을 듣고 대답을 고르며 3턴 대화를 완료할 수 있다', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('tab', { name: '만남 대화' }));

    const list = scenariosFor('ph');
    expect(list.length).toBeGreaterThanOrEqual(5);
    const cafe = list[0];

    await user.click(screen.getByRole('button', { name: `${cafe.title} 대화 시작` }));
    expect(screen.getByText(`[${cafe.turns[0].partner.pronunciation}]`)).toBeInTheDocument();

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

    await user.click(screen.getByRole('tab', { name: '만남 대화' }));
    const cafe = scenariosFor('ph')[0];
    await user.click(screen.getByRole('button', { name: `${cafe.title} 대화 시작` }));

    const choice = cafe.turns[0].choices[0];
    await user.click(screen.getByText(`[${choice.pronunciation}]`));

    await user.click(screen.getByRole('button', { name: `${choice.meaning} 크게 보여주기` }));
    expect(screen.getByRole('dialog', { name: /긴급 전광판/ })).toBeInTheDocument();
  });

  it('영어 트랙(en)과 베트남어(vn)에서도 시나리오 5종을 불러온다', () => {
    expect(scenariosFor('en').length).toBeGreaterThanOrEqual(5);
    expect(scenariosFor('vn').length).toBeGreaterThanOrEqual(5);
  });
});
