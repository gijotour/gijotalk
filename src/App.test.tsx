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
  it('하단 탭이 3개다', async () => {
    await renderApp();
    const nav = screen.getByRole('navigation', { name: '주요 메뉴' });
    const tabs = within(nav).getAllByRole('button');
    expect(tabs).toHaveLength(3);
    expect(tabs.map((t) => t.textContent)).toEqual(['회화', '보관함', '긴급']);
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

describe('App — 모달 5개가 공통 동작을 갖는다', () => {
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

  it('연속 듣기 플레이어가 dialog 로 열린다', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: /연속 듣기 시작/ }));
    expect(screen.getByRole('dialog', { name: '연속 듣기 플레이어' })).toBeInTheDocument();
  });
});

describe('App — 미니 플레이어', () => {
  it('처음에는 보이지 않는다', async () => {
    await renderApp();
    expect(screen.queryByRole('region', { name: '연속 듣기 미니 플레이어' })).not.toBeInTheDocument();
  });

  /**
   * 이번 IA 개편의 핵심입니다.
   * 예전에는 재생 로직이 모달 안에 있어서, 모달을 닫으면 재생이 끊겼습니다.
   */
  it('플레이어를 닫아도 미니 플레이어로 재생이 이어진다', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: /연속 듣기 시작/ }));
    const dialog = screen.getByRole('dialog', { name: '연속 듣기 플레이어' });

    // 플레이어 화면 접기
    await user.click(within(dialog).getByRole('button', { name: /접기/ }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // 미니 플레이어가 재생을 이어받는다
    const mini = screen.getByRole('region', { name: '연속 듣기 미니 플레이어' });
    expect(within(mini).getByRole('button', { name: '일시정지' })).toBeInTheDocument();

    // 목록의 첫 문장을 재생 중이어야 합니다.
    const firstPhrase = PHRASES.find((p) => p.countryId === 'ph')!;
    expect(within(mini).getByText(firstPhrase.original)).toBeInTheDocument();
  });

  it('미니 플레이어에서 일시정지·다음·종료가 동작한다', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: /연속 듣기 시작/ }));
    await user.keyboard('{Escape}');

    const mini = screen.getByRole('region', { name: '연속 듣기 미니 플레이어' });

    await user.click(within(mini).getByRole('button', { name: '일시정지' }));
    expect(within(mini).getByRole('button', { name: '재생' })).toBeInTheDocument();

    await user.click(within(mini).getByRole('button', { name: '다음 문장' }));

    await user.click(within(mini).getByRole('button', { name: '연속 듣기 종료' }));
    expect(
      screen.queryByRole('region', { name: '연속 듣기 미니 플레이어' })
    ).not.toBeInTheDocument();
  });

  it('탭을 옮겨도 미니 플레이어가 계속 떠 있다', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: /연속 듣기 시작/ }));
    await user.keyboard('{Escape}');
    expect(screen.getByRole('region', { name: '연속 듣기 미니 플레이어' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '긴급' }));
    expect(screen.getByRole('region', { name: '연속 듣기 미니 플레이어' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '보관함' }));
    expect(screen.getByRole('region', { name: '연속 듣기 미니 플레이어' })).toBeInTheDocument();
  });
});
