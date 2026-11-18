import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  Maximize2,
  MessageCircle,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import type { Country, Phrase } from '../../types';
import { COUNTRIES } from '../../config';
import {
  scenariosFor,
  scenarioLineAsPhrase,
  type Scenario,
  type ScenarioChoice,
  type ScenarioLine,
} from '../../data/scenarios';
import { playPhrase, stopAllPlayback, unlockAudioPlayback } from '../../utils/speech';

const SCENARIO_DONE_KEY = 'gijo_scenario_done_v1';

function readDoneScenarios(): string[] {
  try {
    const raw = localStorage.getItem(SCENARIO_DONE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function saveDoneScenario(id: string, current: string[]): string[] {
  if (current.includes(id)) return current;
  const next = [...current, id];
  try {
    localStorage.setItem(SCENARIO_DONE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

interface ChatMessage {
  uid: string;
  speaker: 'partner' | 'me';
  line: ScenarioLine;
  tip?: string;
}

interface ScenarioChatProps {
  country: Country;
  speed: number;
  onOpenBillboard: (phrase: Phrase) => void;
}

export const ScenarioChat: React.FC<ScenarioChatProps> = ({
  country,
  speed,
  onOpenBillboard,
}) => {
  const list = scenariosFor(country.id);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [doneIds, setDoneIds] = useState<string[]>(() => readDoneScenarios());

  const [turnIndex, setTurnIndex] = useState(0);
  const [waitingReply, setWaitingReply] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      stopAllPlayback();
    };
  }, []);

  // 나라 변경 시 목록으로 복귀
  useEffect(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    stopAllPlayback();
    setActiveId(null);
    setMessages([]);
    setTurnIndex(0);
    setWaitingReply(false);
  }, [country.id]);

  const speakLine = (line: ScenarioLine) => {
    unlockAudioPlayback();
    setPlayingId(line.id);
    const phrase = scenarioLineAsPhrase(line, country.id);
    const voiceCountry = COUNTRIES.find((c) => c.id === phrase.countryId) ?? country;
    playPhrase({
      phrase,
      country: voiceCountry,
      rate: speed,
      onEnd: () => {
        if (aliveRef.current) setPlayingId(null);
      },
      onError: () => {
        if (aliveRef.current) setPlayingId(null);
      },
    });
  };

  const startScenario = (scenario: Scenario) => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    stopAllPlayback();
    const firstTurn = scenario.turns[0];
    setActiveId(scenario.id);
    setTurnIndex(0);
    setWaitingReply(false);
    setMessages(
      firstTurn
        ? [{ uid: `${scenario.id}-0-p`, speaker: 'partner', line: firstTurn.partner }]
        : []
    );
    if (firstTurn) {
      speakLine(firstTurn.partner);
    }
  };

  const handleBack = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    stopAllPlayback();
    setActiveId(null);
    setWaitingReply(false);
  };

  const activeScenario = list.find((s) => s.id === activeId) ?? null;

  const handlePickChoice = (choice: ScenarioChoice) => {
    if (!activeScenario || waitingReply) return;
    const currentTurn = activeScenario.turns[turnIndex];
    if (!currentTurn) return;

    const myLine: ScenarioLine = {
      id: `${currentTurn.id}-${choice.id}`,
      text: choice.text,
      pronunciation: choice.pronunciation,
      meaning: choice.meaning,
    };

    setMessages((prev) => [
      ...prev,
      { uid: `me-${turnIndex}-${choice.id}`, speaker: 'me', line: myLine, tip: choice.tip },
    ]);
    setWaitingReply(true);
    speakLine(myLine);

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (!aliveRef.current) return;
      const nextIndex = turnIndex + 1;
      const nextTurn = activeScenario.turns[nextIndex];

      setMessages((prev) => {
        const appended: ChatMessage[] = [
          ...prev,
          {
            uid: `reply-${turnIndex}-${choice.id}`,
            speaker: 'partner',
            line: choice.partnerReply,
          },
        ];
        if (nextTurn) {
          appended.push({
            uid: `prompt-${nextIndex}`,
            speaker: 'partner',
            line: nextTurn.partner,
          });
        }
        return appended;
      });

      setTurnIndex(nextIndex);
      setWaitingReply(false);
      speakLine(choice.partnerReply);

      if (!nextTurn) {
        setDoneIds((prev) => saveDoneScenario(activeScenario.id, prev));
      }
    }, 550);
  };

  if (!activeScenario) {
    return (
      <section className="space-y-3" aria-label="만남 대화 시나리오 목록">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-slate-900">새로운 사람 만나 대화하기</h2>
            <p className="text-xs font-medium text-ink-mute mt-0.5">
              상대방 말을 듣고 내 대답을 고르면 대화가 이어집니다
            </p>
          </div>
        </div>

        <ul className="space-y-2.5">
          {list.map((sc) => {
            const done = doneIds.includes(sc.id);
            return (
              <li key={sc.id}>
                <button
                  type="button"
                  onClick={() => startScenario(sc)}
                  aria-label={`${sc.title} 대화 시작`}
                  className="w-full text-left bg-white hover:border-slate-300 border border-slate-200/90 rounded-2xl p-3.5 active:scale-[0.99] transition-all flex items-center gap-3.5"
                >
                  <span
                    className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl shrink-0"
                    aria-hidden="true"
                  >
                    {sc.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-brand">{sc.partnerName}</span>
                      <span className="text-[11px] font-medium text-ink-mute truncate">
                        · {sc.partnerRole}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 mt-0.5 truncate">
                      {sc.title}
                    </h3>
                    <p className="text-xs text-ink-mute truncate mt-0.5">{sc.description}</p>
                  </div>
                  {done ? (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      완료
                    </span>
                  ) : (
                    <span className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 text-ink-soft text-[11px] font-bold">
                      {sc.turns.length}턴
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  const currentTurn = activeScenario.turns[turnIndex];
  const isFinished = turnIndex >= activeScenario.turns.length && !waitingReply;

  return (
    <section className="space-y-3" aria-label={`${activeScenario.title} 대화방`}>
      {/* 대화방 상단 바 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleBack}
          aria-label="대화 목록으로 돌아가기"
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border border-slate-200 text-ink-soft hover:bg-slate-50 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-2xl leading-none shrink-0" aria-hidden="true">
          {activeScenario.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-black text-slate-900 truncate">{activeScenario.partnerName}</h2>
          <p className="text-[11px] font-medium text-ink-mute truncate">
            {activeScenario.title}
          </p>
        </div>
        <button
          type="button"
          onClick={() => startScenario(activeScenario)}
          aria-label="대화 처음부터 다시하기"
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border border-slate-200 text-ink-soft hover:bg-slate-50 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 대화 말풍선 영역 */}
      <ul className="space-y-2.5" aria-live="polite">
        {messages.map((msg) => {
          const isMe = msg.speaker === 'me';
          const isPlaying = playingId === msg.line.id;
          return (
            <li
              key={msg.uid}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-1`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 space-y-1.5 border ${
                  isMe
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-900 border-slate-200'
                }`}
              >
                <p className="text-sm font-black leading-snug">
                  [{msg.line.pronunciation}]
                </p>
                <p className={`text-xs font-medium ${isMe ? 'text-slate-300' : 'text-ink-soft'}`}>
                  {msg.line.text}
                </p>
                <p className={`text-xs font-bold ${isMe ? 'text-amber-300' : 'text-brand'}`}>
                  {msg.line.meaning}
                </p>

                <div className="pt-1 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => speakLine(msg.line)}
                    aria-label={`${msg.line.meaning} 발음 듣기`}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-colors ${
                      isMe
                        ? isPlaying
                          ? 'bg-brand text-white'
                          : 'bg-white/15 text-white hover:bg-white/25'
                        : isPlaying
                          ? 'bg-brand text-white'
                          : 'bg-slate-100 text-ink hover:bg-slate-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlaying ? '재생 중' : '듣기'}</span>
                  </button>

                  {isMe && (
                    <button
                      type="button"
                      onClick={() => onOpenBillboard(scenarioLineAsPhrase(msg.line, country.id))}
                      aria-label={`${msg.line.meaning} 크게 보여주기`}
                      className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold flex items-center gap-1 active:scale-95"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>전광판</span>
                    </button>
                  )}
                </div>
              </div>

              {msg.tip && (
                <p className="text-[11px] font-medium text-ink-mute px-2">💡 {msg.tip}</p>
              )}
            </li>
          );
        })}
      </ul>

      {/* 내가 대답 고르기 */}
      {currentTurn && !waitingReply && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-xs font-black text-slate-900">
              내가 대답해 보기 ({turnIndex + 1} / {activeScenario.turns.length})
            </span>
            <span className="text-[11px] font-medium text-ink-mute">누르면 바로 말해요</span>
          </div>

          <div className="space-y-2">
            {currentTurn.choices.map((choice) => {
              const previewId = `${currentTurn.id}-${choice.id}`;
              return (
                <div
                  key={choice.id}
                  className="bg-white border border-slate-200 hover:border-brand rounded-xl p-3 flex items-center gap-2.5 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => handlePickChoice(choice)}
                    className="flex-1 min-w-0 text-left active:scale-[0.99]"
                  >
                    <p className="text-sm font-black text-slate-900">[{choice.pronunciation}]</p>
                    <p className="text-xs font-bold text-brand mt-0.5">{choice.meaning}</p>
                    <p className="text-[11px] text-ink-mute mt-0.5 truncate">{choice.text}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      speakLine({
                        id: previewId,
                        text: choice.text,
                        pronunciation: choice.pronunciation,
                        meaning: choice.meaning,
                      })
                    }
                    aria-label={`${choice.meaning} 미리 듣기`}
                    className="w-10 h-10 shrink-0 rounded-xl bg-slate-100 hover:bg-slate-200 text-ink flex items-center justify-center active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 대화 완료 카드 */}
      {isFinished && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-3">
          <div>
            <p className="text-base font-black text-slate-900">대화를 마쳤어요 🎉</p>
            <p className="text-xs font-medium text-ink-mute mt-0.5">
              {activeScenario.partnerName}님과 자연스럽게 3턴 대화를 나눴습니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => startScenario(activeScenario)}
              className="min-h-11 rounded-xl border border-slate-200 text-ink text-xs font-bold hover:bg-slate-50 active:scale-95"
            >
              다른 답으로 해보기
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="min-h-11 rounded-xl bg-brand text-white text-xs font-black active:scale-95"
            >
              다른 사람 만나기
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
