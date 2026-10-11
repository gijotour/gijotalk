// Web Audio API Sound Effects Engine for GIJO Tour
// 0 external audio files needed — 100% works offline with zero latency!

const SFX_MUTED_KEY = 'gijo_sfx_muted_v1';

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private _muted: boolean = false;

  constructor() {
    try {
      this._muted = typeof localStorage !== 'undefined' && localStorage.getItem(SFX_MUTED_KEY) === 'true';
    } catch {
      this._muted = false;
    }
  }

  public get isMuted(): boolean {
    return this._muted;
  }

  public setMuted(muted: boolean): void {
    this._muted = muted;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SFX_MUTED_KEY, String(muted));
      }
    } catch {
      // Ignored
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this._muted);
    return this._muted;
  }

  private initCtx(): AudioContext | null {
    if (this._muted || typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * 사용자 최초 터치 제스처 시 AudioContext 잠금을 해제합니다.
   */
  public unlock(): void {
    const ctx = this.initCtx();
    if (ctx && ctx.state === 'suspended') {
      void ctx.resume();
    }
  }

  /**
   * 정답 효과음 (맑고 상쾌한 메이저 아르페지오 차임벨)
   */
  public playCorrect(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.07);

      const noteStart = startTime + idx * 0.07;
      const noteEnd = noteStart + 0.35;

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.18, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd);
    });
  }

  /**
   * 오답 효과음 (부드러운 단조 톤)
   */
  public playWrong(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [311.13, 261.63]; // Eb4, C4
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.12);

      const noteStart = startTime + idx * 0.12;
      const noteEnd = noteStart + 0.28;

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.15, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd);
    });
  }

  /**
   * 연속 정답(Streak / Combo) 달성 효과음
   */
  public playStreak(combo: number = 2): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const baseFreq = 587.33; // D5
    const multiplier = 1 + Math.min(combo * 0.08, 0.6);
    const notes = [baseFreq * multiplier, (baseFreq * 1.33) * multiplier, (baseFreq * 1.6) * multiplier];
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.05);

      const noteStart = startTime + idx * 0.05;
      const noteEnd = noteStart + 0.3;

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.2, noteStart + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd);
    });
  }

  /**
   * 10문제 완료 시 축하 팡파레
   */
  public playFanfare(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    // G4 -> C5 -> E5 -> G5 -> C6
    const fanfareNotes = [
      { freq: 392.0, time: 0, dur: 0.12 },
      { freq: 523.25, time: 0.12, dur: 0.12 },
      { freq: 659.25, time: 0.24, dur: 0.12 },
      { freq: 783.99, time: 0.36, dur: 0.35 },
      { freq: 1046.5, time: 0.55, dur: 0.6 },
    ];
    const startTime = ctx.currentTime;

    fanfareNotes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, startTime + n.time);

      const noteStart = startTime + n.time;
      const noteEnd = noteStart + n.dur;

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.25, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd);
    });
  }

  /**
   * 카드 뒤집기 / 탭 사운드 (미세한 팝 톤)
   */
  public playFlip(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startTime = ctx.currentTime;
    osc.frequency.setValueAtTime(400, startTime);
    osc.frequency.exponentialRampToValueAtTime(800, startTime + 0.05);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.1, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.08);
  }
}

export const soundEffects = new SoundEffectsEngine();
