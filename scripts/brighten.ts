/**
 * 음성 후처리 — 밝기와 음량 보정.
 *
 * ── 왜 필요한가
 *   macOS 에 설치된 미국 남성 음성(Reed·Ralph·Fred)은 소리가 어둡고 작습니다.
 *   같은 문장으로 재보면 영국 Daniel 의 1/3 밝기입니다. 그런데 이 앱은
 *   필리핀에서 쓰는 물건이라 미국 발음이 맞습니다. 목소리를 바꾸는 대신
 *   나온 소리를 손보는 쪽을 택했습니다.
 *
 * ── 무엇을 하는가
 *   1) 하이셸프 EQ — 3kHz 위를 들어올립니다. 자음(s, t, k, th)이 그 대역에
 *      몰려 있어서, 여기를 올리면 "밝다" 를 넘어 "또렷하다" 가 됩니다.
 *   2) 피크 정규화 — 최대 진폭을 -1dBFS 로 맞춥니다. 흔들리는 차 안에서
 *      듣는 앱이라 작으면 안 들립니다.
 *
 *   외부 도구(ffmpeg·sox)에 기대지 않습니다. 이 저장소는 맥에서 `say` 만으로
 *   오디오를 만드는 구조라, 새 의존성을 더하면 다음 사람이 재현을 못 합니다.
 *   바이쿼드 필터 하나면 되는 일입니다.
 */

/** RBJ 쿡북 하이셸프 계수 */
function highShelfCoeffs(sampleRate: number, freq: number, gainDb: number, slope = 1) {
  const A = Math.pow(10, gainDb / 40);
  const w0 = (2 * Math.PI * freq) / sampleRate;
  const cos = Math.cos(w0);
  const sin = Math.sin(w0);
  const alpha = (sin / 2) * Math.sqrt((A + 1 / A) * (1 / slope - 1) + 2);
  const twoSqrtAAlpha = 2 * Math.sqrt(A) * alpha;

  const b0 = A * (A + 1 + (A - 1) * cos + twoSqrtAAlpha);
  const b1 = -2 * A * (A - 1 + (A + 1) * cos);
  const b2 = A * (A + 1 + (A - 1) * cos - twoSqrtAAlpha);
  const a0 = A + 1 - (A - 1) * cos + twoSqrtAAlpha;
  const a1 = 2 * (A - 1 - (A + 1) * cos);
  const a2 = A + 1 - (A - 1) * cos - twoSqrtAAlpha;

  return { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0 };
}

export interface BrightenOptions {
  sampleRate: number;
  /** 이 주파수 위를 들어올립니다 */
  shelfHz: number;
  /** 몇 dB 올릴지 */
  gainDb: number;
  /** 정규화 목표 (dBFS). 0 이면 정규화하지 않습니다. */
  peakDb: number;
}

/** 16비트 정수 샘플 배열을 제자리에서 보정합니다. */
export function brighten(samples: Int16Array, opts: BrightenOptions): Int16Array {
  const { b0, b1, b2, a1, a2 } = highShelfCoeffs(opts.sampleRate, opts.shelfHz, opts.gainDb);

  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  const out = new Float64Array(samples.length);
  let peak = 0;

  for (let i = 0; i < samples.length; i++) {
    const x0 = samples[i];
    const y0 = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1;
    x1 = x0;
    y2 = y1;
    y1 = y0;
    out[i] = y0;
    const abs = Math.abs(y0);
    if (abs > peak) peak = abs;
  }

  // 피크 정규화. EQ 로 커진 만큼을 되돌려 클리핑을 막습니다.
  const target = 32767 * Math.pow(10, opts.peakDb / 20);
  const scale = peak > 0 ? target / peak : 1;

  const result = new Int16Array(samples.length);
  for (let i = 0; i < out.length; i++) {
    result[i] = Math.max(-32768, Math.min(32767, Math.round(out[i] * scale)));
  }
  return result;
}
