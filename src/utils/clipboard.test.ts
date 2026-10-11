import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyText } from './clipboard';

describe('copyText', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('빈 문자열이 들어오면 false 를 반환한다', async () => {
    const res = await copyText('');
    expect(res).toBe(false);
  });

  it('navigator.clipboard.writeText 가 성공하면 true 를 반환한다', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      clipboard: { writeText: writeTextMock },
    });

    const res = await copyText('Hello World');
    expect(res).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('Hello World');
  });

  it('navigator.clipboard 가 실패하면 execCommand 로 폴백하여 처리한다', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'));
    const execCommandMock = vi.fn().mockReturnValue(true);

    vi.stubGlobal('navigator', {
      clipboard: { writeText: writeTextMock },
    });
    document.execCommand = execCommandMock;

    const res = await copyText('Fallback Text');
    expect(res).toBe(true);
    expect(execCommandMock).toHaveBeenCalledWith('copy');
  });
});
