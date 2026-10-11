import { describe, it, expect, beforeEach, vi } from 'vitest';
import { soundEffects } from './soundEffects';

describe('soundEffects', () => {
  beforeEach(() => {
    localStorage.clear();
    soundEffects.setMuted(false);
  });

  it('기본적으로 음소거가 해제되어 있다', () => {
    expect(soundEffects.isMuted).toBe(false);
  });

  it('음소거를 토글할 수 있고 localStorage에 저장된다', () => {
    const muted = soundEffects.toggleMute();
    expect(muted).toBe(true);
    expect(soundEffects.isMuted).toBe(true);
    expect(localStorage.getItem('gijo_sfx_muted_v1')).toBe('true');

    const unmuted = soundEffects.toggleMute();
    expect(unmuted).toBe(false);
    expect(soundEffects.isMuted).toBe(false);
    expect(localStorage.getItem('gijo_sfx_muted_v1')).toBe('false');
  });

  it('Web Audio 가 없는 환경에서도 메서드 호출 시 에러를 던지지 않는다', () => {
    expect(() => {
      soundEffects.playCorrect();
      soundEffects.playWrong();
      soundEffects.playStreak(3);
      soundEffects.playFanfare();
      soundEffects.playFlip();
    }).not.toThrow();
  });

  it('음소거 상태일 때는 오디오를 재생하지 않고 에러 없이 통과한다', () => {
    soundEffects.setMuted(true);
    expect(() => {
      soundEffects.playCorrect();
      soundEffects.playWrong();
      soundEffects.playFanfare();
    }).not.toThrow();
  });
});
