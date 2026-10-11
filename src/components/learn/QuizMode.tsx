import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, X, Flame, RotateCcw, Award } from 'lucide-react';
import type { Country } from '../../types';
import { VOCAB_WORDS } from '../../data/vocab';
import {
  isVocabWord,
  nextQuizSet,
  vocabDisplay,
  vocabItemById,
  vocabSourceCountry,
  vocabUnitById,
  wordsFor,
  type VocabItem,
  type VocabProgressMap,
} from '../../utils/vocab';
import { useVocabAudio } from '../../hooks/useVocabAudio';
import { soundEffects } from '../../utils/soundEffects';

interface QuizModeProps {
  country: Country;
  speed: number;
  savedIds: string[];
  progress: VocabProgressMap;
  onAnswer: (id: string, correct: boolean) => void;
  onClose: () => void;
}

type QuestionKind = 'choice' | 'recall';

interface Question {
  item: VocabItem;
  kind: QuestionKind;
  options: string[];
}

interface Quiz {
  questions: Question[];
  usingFallback: boolean;
}

const QUESTIONS_PER_SET = 10;

/** 보기를 섞습니다. 정답이 늘 같은 자리에 있으면 자리만 외웁니다. */
function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** 오답 보기는 같은 단원에서 먼저 고릅니다 — 엉뚱한 단원 뜻은 너무 쉽게 걸러집니다. */
function buildOptions(item: VocabItem, country: Country): string[] {
  const source = vocabSourceCountry(country.id);
  const pickFrom = (list: typeof VOCAB_WORDS) =>
    list.map((w) => w.meaning).filter((m) => m !== item.meaning);

  const sameUnit = pickFrom(
    VOCAB_WORDS.filter((w) => w.countryId === source && w.unitId === item.unitId)
  );
  const sameCountry = pickFrom(VOCAB_WORDS.filter((w) => w.countryId === source));
  const anywhere = pickFrom(VOCAB_WORDS);

  const distractors: string[] = [];
  for (const meaning of [...shuffle(sameUnit), ...shuffle(sameCountry), ...anywhere]) {
    if (distractors.length >= 3) break;
    if (!distractors.includes(meaning)) distractors.push(meaning);
  }

  return shuffle([item.meaning, ...distractors]);
}

function buildQuiz(
  country: Country,
  savedIds: string[],
  progress: VocabProgressMap,
  customPool?: VocabItem[]
): Quiz {
  const saved = savedIds
    .map(vocabItemById)
    .filter((item): item is VocabItem => Boolean(item));

  // 저장한 게 너무 적으면 4지선다가 성립하지 않습니다. 이 나라 단어 전체로 넘어갑니다.
  const usingFallback = !customPool && saved.length < 4;
  const pool: VocabItem[] = customPool && customPool.length > 0
    ? customPool
    : usingFallback
      ? wordsFor(country.id)
      : saved;

  const count = customPool ? customPool.length : QUESTIONS_PER_SET;
  const order = nextQuizSet(
    pool.map((item) => item.id),
    progress,
    count
  );

  const questions = order
    .map((id) => pool.find((item) => item.id === id))
    .filter((item): item is VocabItem => Boolean(item))
    .map((item, i) => {
      // 두 가지 유형을 번갈아 냅니다 — 한 유형만 나오면 요령이 생깁니다.
      const kind: QuestionKind = i % 2 === 0 ? 'choice' : 'recall';
      return { item, kind, options: kind === 'choice' ? buildOptions(item, country) : [] };
    });

  return { questions, usingFallback };
}

/**
 * 복습 퀴즈 — 10문제 한 세트.
 *
 *   (a) 이모지 + 소리 + 발음 → 뜻 4지선다
 *   (b) 뜻 → 발음 확인 → "알아요 / 몰라요"
 *
 * 틀린 것(`wrong`)은 다음 세트에서 먼저 나옵니다 — `nextQuizSet` 이 정렬합니다.
 */
export const QuizMode: React.FC<QuizModeProps> = ({
  country,
  speed,
  savedIds,
  progress,
  onAnswer,
  onClose,
}) => {
  const [quiz, setQuiz] = useState<Quiz>(() => buildQuiz(country, savedIds, progress));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [wrongItems, setWrongItems] = useState<VocabItem[]>([]);
  const [sfxMuted, setSfxMuted] = useState(() => soundEffects.isMuted);

  const { playingId, play, stop } = useVocabAudio(country, speed);

  // 모달 닫힘 또는 언마운트 시 오디오 즉시 정지
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const handleClose = () => {
    stop();
    onClose();
  };

  const total = quiz.questions.length;
  const question = quiz.questions[index];

  // 효과음 토글
  const toggleSfx = () => {
    const next = soundEffects.toggleMute();
    setSfxMuted(next);
  };

  const restart = () => {
    stop();
    setQuiz(buildQuiz(country, savedIds, progress));
    setIndex(0);
    setPicked(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
    setStreak(0);
    setWrongItems([]);
  };

  const restartWithPool = (pool: VocabItem[]) => {
    stop();
    setQuiz(buildQuiz(country, savedIds, progress, pool));
    setIndex(0);
    setPicked(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
    setStreak(0);
    setWrongItems([]);
  };

  const advance = () => {
    stop();
    setPicked(null);
    setRevealed(false);
    if (index + 1 >= total) {
      setFinished(true);
      soundEffects.playFanfare();
    } else {
      setIndex(index + 1);
    }
  };

  const answer = (correct: boolean) => {
    if (correct) {
      setScore((s) => s + 1);
      setStreak((st) => {
        const nextStreak = st + 1;
        if (nextStreak >= 2) {
          soundEffects.playStreak(nextStreak);
        } else {
          soundEffects.playCorrect();
        }
        return nextStreak;
      });
    } else {
      setStreak(0);
      soundEffects.playWrong();
      setWrongItems((prev) =>
        prev.some((it) => it.id === question.item.id) ? prev : [...prev, question.item]
      );
    }
    onAnswer(question.item.id, correct);
  };

  const header = (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <h3 className="text-sm font-black text-slate-900">복습 퀴즈</h3>
        {total > 0 && !finished && (
          <p className="text-xs font-bold text-ink-mute mt-0.5">
            {index + 1} / {total} 문제
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleSfx}
          aria-label={sfxMuted ? '효과음 켜기' : '효과음 끄기'}
          title={sfxMuted ? '효과음 켜기' : '효과음 끄기'}
          className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border-2 transition-all active:scale-95 ${
            sfxMuted ? 'border-slate-200 text-ink-mute' : 'border-amber-300 bg-amber-50 text-amber-700'
          }`}
        >
          {sfxMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={handleClose}
          aria-label="퀴즈 닫기"
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border-2 border-slate-200 text-ink-soft active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (total === 0) {
    return (
      <section
        aria-label="복습 퀴즈"
        className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-xs space-y-3"
      >
        {header}
        <p className="text-xs font-bold text-ink-mute text-center py-8">
          아직 복습할 단어가 없어요. 배우기에서 ★ 를 눌러 담아 보세요.
        </p>
      </section>
    );
  }

  if (finished) {
    const percent = Math.round((score / total) * 100);
    const starCount = percent >= 90 ? 3 : percent >= 60 ? 2 : 1;

    return (
      <section
        aria-label="복습 퀴즈"
        className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-xs space-y-4"
      >
        {header}
        <div className="text-center py-5 space-y-2.5">
          <p className="text-5xl" aria-hidden="true">
            {score === total ? '🏆' : '🎉'}
          </p>
          <div className="flex justify-center gap-1.5 text-2xl text-amber-400">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={i < starCount ? 'opacity-100 scale-110' : 'opacity-25 grayscale'}>
                ⭐
              </span>
            ))}
          </div>
          <p className="text-xl font-black text-slate-900">복습 완료! ({percent}점)</p>
          <p className="text-sm font-extrabold text-brand">
            {total}문제 중 {score}개 맞았어요
          </p>
          <p className="text-xs font-bold text-ink-mute">
            {score === total
              ? '완벽해요! 단어장에 저장된 모든 표현을 마스터했습니다.'
              : '틀린 문제는 다음 복습 때 먼저 나오니 안심하세요.'}
          </p>
        </div>

        <div className="space-y-2">
          {wrongItems.length > 0 && (
            <button
              type="button"
              onClick={() => restartWithPool(wrongItems)}
              className="w-full min-h-12 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-black shadow-xs active:scale-95 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>틀린 {wrongItems.length}개 바로 다시 풀기</span>
            </button>
          )}

          <button
            type="button"
            onClick={restart}
            className="w-full min-h-12 rounded-2xl bg-brand text-white text-sm font-black shadow-xs active:scale-95 flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>처음부터 다시 하기</span>
          </button>
        </div>
      </section>
    );
  }

  const display = vocabDisplay(question.item, country.id);
  const unit = vocabUnitById(question.item.unitId);
  const emoji = isVocabWord(question.item) ? question.item.emoji : unit?.emoji ?? '💬';
  const playing = playingId === question.item.id;

  const playButton = (
    <button
      type="button"
      onClick={() => play(question.item)}
      aria-label="소리 듣기"
      className={`min-h-12 px-5 flex items-center justify-center gap-2 rounded-2xl text-sm font-black shadow-xs active:scale-95 transition-all ${
        playing ? 'bg-amber-400 text-ink animate-pulse' : 'bg-brand text-white hover:bg-brand-hover'
      }`}
    >
      <Volume2 className="w-5 h-5" />
      <span>소리 듣기</span>
    </button>
  );

  return (
    <section
      aria-label="복습 퀴즈"
      className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-xs space-y-3.5"
    >
      {header}

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-brand to-amber-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${Math.round(((index + 1) / total) * 100)}%` }}
        />
      </div>

      {/* Streak Badge */}
      {streak >= 2 && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-black shadow-xs animate-bounce w-fit mx-auto">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>{streak}연속 정답! 콤보 유지 중 🔥</span>
        </div>
      )}

      {quiz.usingFallback && (
        <p className="text-xs font-bold text-alert bg-accent-tint border border-accent rounded-xl px-3 py-2">
          저장한 것이 적어서 {country.name} 단어 전체로 연습해요.
        </p>
      )}

      {question.kind === 'choice' ? (
        <div className="space-y-3">
          <div className="text-center space-y-2 py-2">
            <p className="text-6xl leading-none select-none" aria-hidden="true">
              {emoji}
            </p>
            <p className="inline-block bg-accent text-ink px-4 py-1.5 rounded-2xl text-2xl font-black">
              {display.pronunciation}
            </p>
            <div className="flex justify-center pt-1">{playButton}</div>
          </div>

          <p className="text-center text-xs font-black text-ink-soft">무슨 뜻일까요?</p>

          <ul className="space-y-2">
            {question.options.map((option) => {
              const isAnswer = option === question.item.meaning;
              const chosen = picked === option;
              const tone = !picked
                ? 'bg-white border-slate-200 text-slate-900 hover:border-brand-vivid'
                : isAnswer
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-black'
                  : chosen
                    ? 'bg-rose-50 border-rose-400 text-rose-900 line-through'
                    : 'bg-white border-slate-200 text-ink-mute';
              return (
                <li key={option}>
                  <button
                    type="button"
                    disabled={picked !== null}
                    onClick={() => {
                      setPicked(option);
                      answer(isAnswer);
                    }}
                    className={`w-full min-h-12 px-4 rounded-2xl border-2 text-sm font-extrabold text-left active:scale-[0.99] transition-all ${tone}`}
                  >
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>

          {picked && (
            <div className="pt-1 space-y-2">
              <p className="text-center text-sm font-black text-slate-900">
                {picked === question.item.meaning
                  ? '맞았어요! 👏'
                  : `아쉬워요 — 정답은 "${question.item.meaning}"`}
              </p>
              <button
                type="button"
                onClick={advance}
                className="w-full min-h-12 rounded-2xl bg-brand text-white text-sm font-black shadow-xs active:scale-95"
              >
                {index + 1 >= total ? '결과 보기' : '다음 문제 ➔'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-center space-y-2 py-4">
            <p className="text-xs font-black text-ink-soft">이 말을 할 수 있나요?</p>
            <p className="text-3xl font-black text-slate-900">{question.item.meaning}</p>
          </div>

          {revealed ? (
            <div className="text-center space-y-2 bg-brand-tint border-2 border-brand-vivid/40 rounded-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
              <p className="inline-block bg-accent text-ink px-4 py-1.5 rounded-2xl text-2xl font-black">
                {display.pronunciation}
              </p>
              <p className="text-sm font-extrabold text-slate-700 font-display">
                {display.text}
              </p>
              <div className="flex justify-center pt-1">{playButton}</div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundEffects.playFlip();
                setRevealed(true);
              }}
              className="w-full min-h-12 rounded-2xl border-2 border-slate-200 bg-white text-sm font-black text-ink-soft hover:border-brand-vivid active:scale-95 transition-all"
            >
              답 보기
            </button>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                answer(false);
                advance();
              }}
              className="flex-1 min-h-12 rounded-2xl border-2 border-slate-200 bg-white text-sm font-black text-ink-soft hover:bg-slate-50 active:scale-95 transition-all"
            >
              몰라요
            </button>
            <button
              type="button"
              onClick={() => {
                answer(true);
                advance();
              }}
              className="flex-1 min-h-12 rounded-2xl bg-brand text-white text-sm font-black shadow-xs hover:bg-brand-hover active:scale-95 transition-all"
            >
              알아요 👍
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
