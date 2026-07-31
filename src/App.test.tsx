import { describe, it, expect } from 'vitest';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { PHRASES } from './config';

/**
 * 앱을 띄우고 마운트 시 시작된 비동기 작업(오프라인 저장 상태 조회 등)이
 * 끝날 때까지 기다립니다. 기다리지 않으면 테스트가 끝난 뒤에 상태가 갱신되어
 * act() 경고가 납니다.
 */
const renderApp = async () => {
  const result = render(<App />);
  await act(async () => {});
  return result;
};

/**
 * 앱 전체를 실제로 띄워서 확인합니다.
 * 개별 유닛 테스트가 통과해도 조립이 틀리면 화면은 깨지므로, 조립을 검증합니다.
 */
describe('App — 조립 검증', () => {
  it('하단 탭이 4개다', async () => {
    await renderApp();
    const nav = screen.getByRole('navigation', { name: '주요 메뉴' });
    const tabs = within(nav).getAllByRole('button');
    expect(tabs).toHaveLength(4);
    expect(tabs.map((t) => t.textContent)).toEqual(['회화', '일정', '보관함', '긴급']);
  });

  it('일정 탭을 열면 파일 올리기와 양식 받기가 함께 보인다', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: '일정' }));

    expect(screen.getByText('일정표 파일 올리기')).toBeInTheDocument();
    // 양식 없이 업로드만 있으면 가이드가 무엇을 보내야 할지 알 수 없습니다.
    // 엑셀을 앞에 두되 텍스트 양식도 남깁니다 — 붙여넣기·링크 경로가 텍스트 기반입니다.
    expect(screen.getByText('엑셀 양식 받기')).toBeInTheDocument();
    expect(screen.getByText('텍스트 양식')).toBeInTheDocument();
    // 안드로이드 파일 선택기가 카톡 파일을 회색 처리해 아예 못 고르는 일이 있습니다.
    // 붙여넣기 우회로가 없으면 그 상태에서 할 수 있는 게 없습니다.
    expect(screen.getByLabelText('일정표 붙여넣기')).toBeInTheDocument();
  });

  it('붙여넣기로도 일정표가 저장된다 (파일 선택기가 막혔을 때의 우회로)', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: '일정' }));
    await user.click(screen.getByLabelText('일정표 붙여넣기'));
    await user.paste(
      '#기조톡일정 v1\n제목: 붙여넣기 테스트\n[2026-08-01] 1일차\n09:00 | 이동 | 공항으로 이동'
    );
    await user.click(screen.getByRole('button', { name: '붙여넣은 내용으로 저장' }));

    expect(screen.getByText('붙여넣기 테스트')).toBeInTheDocument();
    expect(screen.getByText('공항으로 이동')).toBeInTheDocument();
  });

  it('일정표 파일 선택기에 accept 필터를 걸지 않는다 (안드로이드 회귀)', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: '일정' }));
    const input = document.getElementById('gijo-itinerary-input');
    // accept 를 걸면 카톡이 넘기는 application/octet-stream 파일이 회색 처리됩니다.
    expect(input).not.toBeNull();
    expect(input!.hasAttribute('accept')).toBe(false);
  });

  it('첫 화면에 프로모 배너 없이 회화 카드가 바로 보인다', async () => {
    await renderApp();
    expect(screen.queryByText(/무한 연속 오디오 듣기 모드/)).not.toBeInTheDocument();
    expect(screen.queryByText(/원하는 특수 상황 표현이/)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Para po!' })).toBeInTheDocument();
  });

  it('검색이 목록을 좁힌다', async () => {
    const user = userEvent.setup();
    await renderApp();

    expect(screen.getByRole('heading', { name: 'Para po!' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('회화 검색'), '경찰');

    expect(screen.queryByRole('heading', { name: 'Para po!' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Pakitawag po ng pulis/ })).toBeInTheDocument();
  });

  it('탭을 바꾸면 내용이 바뀐다', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: '긴급' }));
    expect(screen.getByText(/3초 긴급 현장 외치기 전광판 모드/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '보관함' }));
    expect(screen.getByText(/아직 저장된 문장이 없습니다/)).toBeInTheDocument();
  });

  it('북마크를 누르면 보관함에 담기고 뱃지가 올라간다', async () => {
    const user = userEvent.setup();
    await renderApp();

    const cards = screen.getAllByRole('button', { name: '저장하기' });
    await user.click(cards[0]);

    const nav = screen.getByRole('navigation', { name: '주요 메뉴' });
    expect(within(nav).getByText('1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /보관함/ }));
    expect(screen.queryByText(/아직 저장된 문장이 없습니다/)).not.toBeInTheDocument();
  });
});

describe('App — 모달이 공통 동작을 갖는다', () => {
  it('AI 모달이 dialog 로 열리고 ESC 로 닫힌다', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'AI에게 맞춤 표현 질문하기' }));
    expect(screen.getByRole('dialog', { name: 'AI 맞춤 현지 회화' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('전광판이 dialog 로 열리고 ESC 로 닫힌다', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getAllByRole('button', { name: '3초 긴급 현장 전광판 확대' })[0]);
    expect(screen.getByRole('dialog', { name: /긴급 전광판/ })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('발음 체크 모달이 dialog 로 열린다', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getAllByRole('button', { name: '내 발음 연습하기 (음성인식)' })[0]);
    expect(screen.getByRole('dialog', { name: '실전 발음 체크' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

});

