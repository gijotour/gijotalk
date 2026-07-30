import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

const Sample = ({ onClose }: { onClose: () => void }) => (
  <Modal onClose={onClose} label="테스트 모달" panelClassName="panel">
    <button>첫 번째</button>
    <button>두 번째</button>
    <button>세 번째</button>
  </Modal>
);

describe('Modal — 모든 모달이 공유하는 동작', () => {
  it('dialog 역할과 이름을 스크린리더에 노출한다', () => {
    render(<Sample onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('테스트 모달');
  });

  it('ESC 로 닫힌다', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Sample onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('열리면 첫 번째 요소로 포커스가 이동한다', () => {
    render(<Sample onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: '첫 번째' })).toHaveFocus();
  });

  it('Tab 이 모달 안에서 순환한다 (포커스 트랩)', async () => {
    const user = userEvent.setup();
    render(<Sample onClose={vi.fn()} />);

    expect(screen.getByRole('button', { name: '첫 번째' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: '두 번째' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: '세 번째' })).toHaveFocus();

    // 마지막에서 Tab → 처음으로 되감김 (밖으로 새지 않음)
    await user.tab();
    expect(screen.getByRole('button', { name: '첫 번째' })).toHaveFocus();
  });

  it('Shift+Tab 이 뒤로 순환한다', async () => {
    const user = userEvent.setup();
    render(<Sample onClose={vi.fn()} />);

    expect(screen.getByRole('button', { name: '첫 번째' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: '세 번째' })).toHaveFocus();
  });

  it('열려 있는 동안 배경 스크롤을 잠그고, 닫으면 되돌린다', () => {
    const { unmount } = render(<Sample onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('닫으면 열기 전 요소로 포커스가 돌아온다', async () => {
    const trigger = document.createElement('button');
    trigger.textContent = '열기';
    document.body.appendChild(trigger);
    trigger.focus();
    expect(trigger).toHaveFocus();

    const { unmount } = render(<Sample onClose={vi.fn()} />);
    expect(trigger).not.toHaveFocus();

    unmount();
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it('배경을 누르면 닫힌다', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(<Sample onClose={onClose} />);

    await user.click(container.firstChild as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnBackdrop=false 면 배경을 눌러도 닫히지 않는다', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Modal onClose={onClose} label="전광판" closeOnBackdrop={false}>
        <button>확인</button>
      </Modal>
    );

    await user.click(container.firstChild as Element);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('내용을 누르면 닫히지 않는다', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Sample onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: '두 번째' }));
    expect(onClose).not.toHaveBeenCalled();
  });
});
