import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { PASSCODE_HASH, UNLOCK_STORAGE_KEY } from '../../utils/appLock';
import {
  SCENARIOS,
  scenarioLineAsPhrase,
  scenariosFor,
  scenarioVocabItemById,
} from '../../data/scenarios';
import { VOCAB_SAVED_KEY, vocabItemById } from '../../utils/vocab';

const renderApp = async () => {
  localStorage.setItem(UNLOCK_STORAGE_KEY, PASSCODE_HASH);
  const result = render(<App />);
  await act(async () => {});
  return result;
};

describe('만남 대화 시나리오', () => {
  it('앱을 열면 만남 대화가 메인으로 열리고 필리핀어(타갈로그) 최소 단어로 4턴 대화를 완료한다', async () => {
    const user = userEvent.setup();
    await renderApp();

    // 만남 대화가 기본 메인 화면이고 상단 오프라인 저장 배너도 바로 노출됩니다.
    expect(screen.getByRole('tab', { name: '만남 대화' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: /오프라인 발음 지금 받기/ })).toBeInTheDocument();

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

  it('0.8x 느리게, ★ 단어장 저장, 말하기 연습, 1단어 바꿔 말하기가 동작한다', async () => {
    const user = userEvent.setup();
    await renderApp();

    // restaurant 시나리오 (Turn 1 부터 1단어 바꿔 말하기 칩 보유)
    const rest = scenariosFor('ph').find((s) => s.id === 'sc-ph-restaurant')!;
    await user.click(screen.getByRole('button', { name: `${rest.title} 대화 시작` }));

    // 0.8x 속도 토글
    const slowBtn = screen.getByRole('button', { name: '0.8배 천천히 듣기 전환' });
    expect(slowBtn).toHaveAttribute('aria-pressed', 'false');
    await user.click(slowBtn);
    expect(slowBtn).toHaveAttribute('aria-pressed', 'true');

    // 1단어 바꿔 말하기 칩 클릭 후 '이걸로 답하기'
    await user.click(screen.getByRole('button', { name: '3명' }));
    expect(screen.getByText('[탓로 포.]')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '이걸로 답하기' }));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 620));
    });
    expect(screen.getByText('세 명이요.')).toBeInTheDocument();

    // 내 말풍선 ★ 저장 -> 내 단어장 복원 확인
    await user.click(screen.getByRole('button', { name: '세 명이요. 단어장에 저장' }));
    const saved = JSON.parse(localStorage.getItem(VOCAB_SAVED_KEY) ?? '[]') as string[];
    expect(saved[0]).toBe('sc-ph-restaurant-t1-c1-s1');
    expect(vocabItemById(saved[0])?.meaning).toBe('세 명이요.');

    // 말하기 버튼으로 실전 발음 체크 모달 열기
    await user.click(screen.getByRole('button', { name: '세 명이요. 발음 따라 말하기' }));
    expect(screen.getByRole('dialog', { name: '실전 발음 체크' })).toBeInTheDocument();
    await user.keyboard('{Escape}');

    // 내 단어장 탭에서 저장된 대화 문장 노출 확인
    await user.click(screen.getByRole('button', { name: '대화 목록으로 돌아가기' }));
    await user.click(screen.getByRole('tab', { name: /내 단어장/ }));
    expect(screen.getByText('세 명이요.')).toBeInTheDocument();
  });

  it('필리핀어(ph)·영어(en)·베트남어(vn) 모든 대사가 4턴×4개 선택지, 4단어 이하 최소 단어이고 각 언어 음성 코드로 매핑된다', () => {
    for (const countryId of ['ph', 'en', 'vn'] as const) {
      const list = scenariosFor(countryId);
      expect(list).toHaveLength(5);
      for (const sc of list) {
        expect(sc.turns).toHaveLength(4);
        for (const turn of sc.turns) {
          expect(turn.choices.length).toBeGreaterThanOrEqual(4);
          expect(turn.partner.text.trim().split(/\s+/).length).toBeLessThanOrEqual(4);
          expect(scenarioLineAsPhrase(turn.partner, countryId).countryId).toBe(countryId);
          expect(scenarioVocabItemById(turn.partner.id)?.meaning).toBe(turn.partner.meaning);
          for (const ch of turn.choices) {
            expect(ch.text.trim().split(/\s+/).length).toBeLessThanOrEqual(4);
            expect(ch.partnerReply.text.trim().split(/\s+/).length).toBeLessThanOrEqual(4);
            expect(scenarioVocabItemById(ch.partnerReply.id)?.meaning).toBe(ch.partnerReply.meaning);
            const chId = `${sc.id}-${turn.id}-${ch.id}`;
            expect(scenarioVocabItemById(chId)?.meaning).toBe(ch.meaning);
            ch.swapChips?.forEach((chip, sIdx) => {
              expect(chip.text.trim().split(/\s+/).length).toBeLessThanOrEqual(4);
              expect(scenarioVocabItemById(`${chId}-s${sIdx}`)?.meaning).toBe(chip.meaning);
            });
          }
        }
      }
    }
    expect(SCENARIOS).toHaveLength(15);
  });
});
