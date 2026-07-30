// Web Audio API & Speech Synthesis Engine for Quick Pass

class StreetNoiseAudioEngine {
  private ctx: AudioContext | null = null;
  private noiseGain: GainNode | null = null;
  private isRunning: boolean = false;
  private currentVolume: number = 0.3;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private noiseBufferNode: AudioBufferSourceNode | null = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public startNoise(volume = 0.3) {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isRunning) {
      this.setVolume(volume);
      return;
    }

    this.currentVolume = volume;
    this.isRunning = true;

    // Master noise gain
    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.value = this.currentVolume * 0.4;
    this.noiseGain.connect(this.ctx.destination);

    // 1. Create Motorcycle Engine Rumble (Low frequency sawtooth with LFO)
    const engineOsc = this.ctx.createOscillator();
    engineOsc.type = 'sawtooth';
    engineOsc.frequency.setValueAtTime(65, this.ctx.currentTime); // 65Hz idle rumble

    const engineFilter = this.ctx.createBiquadFilter();
    engineFilter.type = 'lowpass';
    engineFilter.frequency.setValueAtTime(220, this.ctx.currentTime);

    // LFO for engine RPM vibration
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(8, this.ctx.currentTime); // 8Hz rev rumble
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(15, this.ctx.currentTime);
    lfo.connect(engineOsc.frequency);
    lfo.start();

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    engineOsc.connect(engineFilter);
    engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.noiseGain);
    engineOsc.start();
    this.engineOsc = engineOsc;

    // 2. Traffic Air & Wind White Noise Buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const trafficGain = this.ctx.createGain();
    trafficGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(trafficGain);
    trafficGain.connect(this.noiseGain);
    whiteNoise.start();
    this.noiseBufferNode = whiteNoise;
  }

  public setVolume(volume: number) {
    this.currentVolume = volume;
    if (this.noiseGain && this.ctx) {
      this.noiseGain.gain.setTargetAtTime(volume * 0.4, this.ctx.currentTime, 0.05);
    }
  }

  public stopNoise() {
    if (!this.isRunning) return;
    this.isRunning = false;
    try {
      if (this.engineOsc) {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      }
      if (this.noiseBufferNode) {
        this.noiseBufferNode.stop();
        this.noiseBufferNode.disconnect();
      }
      if (this.noiseGain) {
        this.noiseGain.disconnect();
      }
    } catch {
      // Ignored
    }
  }

  // Tricycle / TukTuk Horn Sound Effect
  public playHorn() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(440, this.ctx.currentTime); // A4
    osc2.frequency.setValueAtTime(554.37, this.ctx.currentTime); // C#5

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.35);
    osc2.stop(this.ctx.currentTime + 0.35);
  }
}

export const noiseEngine = new StreetNoiseAudioEngine();

/**
 * 브라우저에 내장 음성이 없는 언어를 위한 대체 음성 순서.
 *
 * 타갈로그(tl-PH)는 iOS·안드로이드·데스크톱 어디에도 음성이 없습니다.
 * 아무 처리도 안 하면 voices[0](보통 영어)이 잡혀 "Para po!" 를 영어식으로 읽습니다.
 *
 *  1) fil-PH  — 안드로이드 Google TTS 에는 필리핀어가 있습니다. 있으면 이게 정답입니다.
 *  2) id-ID   — 인도네시아어. 타갈로그와 같은 오스트로네시아어족이라 5모음 체계와
 *               철자-발음 대응이 거의 같습니다. 현지인이 알아듣는 수준은 됩니다.
 *  3) es-*    — 스페인어. 필리핀어 어휘의 상당수가 스페인어 차용어라 모음이 잘 맞습니다.
 *
 * ※ 이건 어디까지나 임시방편입니다. 근본 해결은 문장별 오디오 파일 사전 생성입니다.
 */
const VOICE_FALLBACK_CHAIN: Record<string, string[]> = {
  'tl-ph': ['fil-PH', 'id-ID', 'es-ES', 'es-MX', 'es-US'],
  'lo-la': ['th-TH'],
};

/** langCode 에 맞는 음성 후보를 (정확한 언어 → 대체 언어) 순으로 모읍니다. */
function collectCandidateVoices(
  voices: SpeechSynthesisVoice[],
  langCode: string
): SpeechSynthesisVoice[] {
  const matchBy = (code: string) => {
    const target = code.toLowerCase();
    const prefix = target.split('-')[0];
    return voices.filter((v) => {
      const vl = v.lang.toLowerCase().replace('_', '-');
      return vl === target || vl.startsWith(`${prefix}-`) || vl === prefix;
    });
  };

  const exact = matchBy(langCode);
  if (exact.length > 0) return exact;

  for (const fallback of VOICE_FALLBACK_CHAIN[langCode.toLowerCase()] || []) {
    const hit = matchBy(fallback);
    if (hit.length > 0) return hit;
  }
  return [];
}

// Helper to select optimal local female or male voice from available browser voices
export function getLocalVoice(langCode: string, gender: 'female' | 'male' = 'female'): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const matchedVoices = collectCandidateVoices(voices, langCode);

  const femaleKeywords = [
    'female', 'woman', 'girl', 'samantha', 'kanya', 'linh', 'zira', 'jenny', 'victoria', 
    'sora', 'yuri', 'mei-jia', 'damayanti', 'hana', 'google', 'natural', 'online', 'premium',
    'amelie', 'kyoko', 'sin-ji', 'chiao', 'ting-ting', 'ya-ling', 'sangeeta', 'veena', 'wavenet'
  ];
  const maleKeywords = ['male', 'man', 'boy', 'david', 'mark', 'george', 'alex', 'daniel', 'diego', 'stefan'];

  if (gender === 'female') {
    // 1. Try female keyword matched voice in local language
    const femaleLocalVoice = matchedVoices.find((v) => {
      const name = v.name.toLowerCase();
      const isFemale = femaleKeywords.some((kw) => name.includes(kw));
      const isMale = maleKeywords.some((kw) => name.includes(kw));
      return isFemale && !isMale;
    });
    if (femaleLocalVoice) return femaleLocalVoice;

    // 2. Try non-male voice in local language
    const nonMaleVoice = matchedVoices.find((v) => {
      const name = v.name.toLowerCase();
      return !maleKeywords.some((kw) => name.includes(kw));
    });
    if (nonMaleVoice) return nonMaleVoice;
  } else {
    // Male voice
    const maleVoice = matchedVoices.find((v) => maleKeywords.some((kw) => v.name.toLowerCase().includes(kw)));
    if (maleVoice) return maleVoice;
  }

  // Fallback to first matched local language voice
  if (matchedVoices.length > 0) return matchedVoices[0];

  // Global female voice fallback
  if (gender === 'female') {
    return voices.find((v) => femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))) || voices[0] || null;
  }

  return voices[0] || null;
}

// Web Speech API Text-to-Speech
export function speakPhrase({
  text,
  langCode,
  rate = 1.0,
  volume = 1.0,
  pitch = 1.15,
  voiceGender = 'female',
  onEnd,
  onError,
}: {
  text: string;
  langCode: string;
  rate?: number; // 0.8, 1.0, 1.2
  volume?: number;
  pitch?: number;
  voiceGender?: 'female' | 'male';
  onEnd?: () => void;
  onError?: () => void;
}) {
  if (!('speechSynthesis' in window)) {
    if (onError) onError();
    return;
  }

  window.speechSynthesis.cancel(); // Stop any ongoing speech

  const executeSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = voiceGender === 'female' ? pitch : 1.0;
    utterance.volume = Math.min(1.0, Math.max(0.0, volume));

    const matchedVoice = getLocalVoice(langCode, voiceGender);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      // lang 을 지원되지 않는 코드(tl-PH 등)로 두면 엔진이 voice 지정을 무시하고
      // 기본 음성으로 읽어버립니다. 실제 선택된 음성의 lang 을 따라갑니다.
      utterance.lang = matchedVoice.lang;
    } else {
      utterance.lang = langCode;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      if (onError) onError();
    };

    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      executeSpeak();
    };
  } else {
    executeSpeak();
  }
}

// Interfaces for SpeechRecognition
interface IWindowSpeechRecognition {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

// Pronunciation Check via SpeechRecognition
export function startPronunciationCheck({
  langCode,
  targetText,
  onResult,
  onError,
}: {
  langCode: string;
  targetText: string;
  onResult: (transcript: string, accuracy: number, isMatched: boolean) => void;
  onError: (errorMsg: string) => void;
}) {
  const win = window as unknown as IWindowSpeechRecognition;
  const SpeechRecognitionConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;

  if (!SpeechRecognitionConstructor) {
    onError('이 브라우저는 마이크 음성 인식을 지원하지 않습니다. Chrome/Safari 사용을 권장합니다.');
    return null;
  }

  try {
    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = langCode;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: any) => {
      const result = event.results[0];
      const transcript = result[0].transcript.trim();

      // Compute similarity score
      const score = calculateSimilarity(transcript.toLowerCase(), targetText.toLowerCase());
      const isMatched = score >= 50;

      onResult(transcript, score, isMatched);
    };

    recognition.onerror = (event: any) => {
      let msg = '음성 인식 중 오류가 발생했습니다.';
      if (event.error === 'not-allowed') {
        msg = '마이크 접근 권한이 거부되었습니다. 브라우저 설정에서 마이크를 허용해주세요.';
      } else if (event.error === 'no-speech') {
        msg = '음성이 감지되지 않았습니다. 다시 크게 말씀해주세요.';
      }
      onError(msg);
    };

    recognition.start();
    return recognition;
  } catch (err) {
    console.error('Speech recognition exception:', err);
    onError('마이크를 시작할 수 없습니다.');
    return null;
  }
}

// String similarity computation for pronunciation feedback
function calculateSimilarity(str1: string, str2: string): number {
  const clean1 = str1.replace(/[^\w\s\u0E00-\u0E7F\u0E80-\u0EFF\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/gi, '');
  const clean2 = str2.replace(/[^\w\s\u0E00-\u0E7F\u0E80-\u0EFF\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/gi, '');

  if (clean1 === clean2) return 100;
  if (!clean1 || !clean2) return 0;

  const words1 = clean1.split(/\s+/);
  const words2 = clean2.split(/\s+/);

  let matchCount = 0;
  words1.forEach((w) => {
    if (words2.some((w2) => w2.includes(w) || w.includes(w2))) {
      matchCount++;
    }
  });

  const maxLen = Math.max(words1.length, words2.length);
  const rawScore = Math.round((matchCount / maxLen) * 100);
  return Math.min(100, Math.max(35, rawScore + 25)); // Generous scoring for travelers
}
