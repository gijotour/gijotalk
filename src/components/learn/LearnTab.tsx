import React, { useEffect, useState } from 'react';
import type { Country, Phrase, VocabUnitId } from '../../types';
import { VOCAB_UNITS } from '../../data/vocab';
import type { VocabProgressMap } from '../../utils/vocab';
import { OfflineAudioCard } from '../OfflineAudioCard';
import { UnitList } from './UnitList';
import { UnitScreen } from './UnitScreen';
import { VocabBookshelf } from './VocabBookshelf';
import { ScenarioChat } from './ScenarioChat';

export type LearnSubTab = 'units' | 'scenarios' | 'bookshelf';

interface LearnTabProps {
  country: Country;
  speed: number;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  progress: VocabProgressMap;
  onMarkSeen: (id: string) => void;
  onAnswer: (id: string, correct: boolean) => void;
  unitDone: string[];
  onUnitDone: (stamp: string) => void;
  onOpenBillboard: (phrase: Phrase) => void;
  isOffline?: boolean;
  subTab?: LearnSubTab;
  onChangeSubTab?: (tab: LearnSubTab) => void;
}

/**
 * 배우기 탭 — 단원 학습 + 내 단어장·복습 퀴즈 통합.
 */
export const LearnTab: React.FC<LearnTabProps> = ({
  country,
  speed,
  savedIds,
  onToggleSave,
  progress,
  onMarkSeen,
  onAnswer,
  unitDone,
  onUnitDone,
  onOpenBillboard,
  isOffline = false,
  subTab: controlledSubTab,
  onChangeSubTab,
}) => {
  const [openUnitId, setOpenUnitId] = useState<VocabUnitId | null>(null);
  const [internalSubTab, setInternalSubTab] = useState<LearnSubTab>('scenarios');
  const subTab = controlledSubTab ?? internalSubTab;
  const setSubTab = onChangeSubTab ?? setInternalSubTab;

  // 나라를 바꾸면 단원 목록으로 복귀
  useEffect(() => {
    setOpenUnitId(null);
  }, [country.id]);

  const unit = VOCAB_UNITS.find((u) => u.id === openUnitId);

  if (unit) {
    return (
      <div className="space-y-4 animate-in fade-in duration-150">
        <UnitScreen
          unit={unit}
          country={country}
          speed={speed}
          savedIds={savedIds}
          onToggleSave={onToggleSave}
          progress={progress}
          onMarkSeen={onMarkSeen}
          unitDone={unitDone}
          onUnitDone={onUnitDone}
          onOpenBillboard={onOpenBillboard}
          onBack={() => setOpenUnitId(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3.5 animate-in fade-in duration-150">
      {/* 심플 세그먼트 전환: 만남 대화 / 단원 학습 / 내 단어장 */}
      <div
        role="tablist"
        aria-label="학습 메뉴 전환"
        className="grid grid-cols-3 bg-slate-100 p-1 rounded-2xl border border-slate-200/70"
      >
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'scenarios'}
          onClick={() => setSubTab('scenarios')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'scenarios'
              ? 'bg-white text-ink shadow-xs'
              : 'text-ink-soft hover:text-ink'
          }`}
        >
          만남 대화
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'units'}
          onClick={() => setSubTab('units')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'units'
              ? 'bg-white text-ink shadow-xs'
              : 'text-ink-soft hover:text-ink'
          }`}
        >
          단원 학습
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'bookshelf'}
          onClick={() => setSubTab('bookshelf')}
          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'bookshelf'
              ? 'bg-white text-ink shadow-xs'
              : 'text-ink-soft hover:text-ink'
          }`}
        >
          <span>내 단어장</span>
          {savedIds.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold leading-none">
              {savedIds.length}
            </span>
          )}
        </button>
      </div>

      {subTab === 'units' ? (
        <>
          <OfflineAudioCard country={country} isOffline={isOffline} />
          <UnitList
            country={country}
            progress={progress}
            unitDone={unitDone}
            onOpenUnit={setOpenUnitId}
          />
        </>
      ) : subTab === 'scenarios' ? (
        <ScenarioChat
          country={country}
          speed={speed}
          onOpenBillboard={onOpenBillboard}
        />
      ) : (
        <VocabBookshelf
          country={country}
          speed={speed}
          savedIds={savedIds}
          onToggleSave={onToggleSave}
          progress={progress}
          onAnswer={onAnswer}
        />
      )}
    </div>
  );
};
