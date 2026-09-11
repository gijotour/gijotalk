import React, { useEffect, useState } from 'react';
import type { Country, Phrase, VocabUnitId } from '../../types';
import { VOCAB_UNITS } from '../../data/vocab';
import type { VocabProgressMap } from '../../utils/vocab';
import { UnitList } from './UnitList';
import { UnitScreen } from './UnitScreen';

interface LearnTabProps {
  country: Country;
  speed: number;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  progress: VocabProgressMap;
  onMarkSeen: (id: string) => void;
  unitDone: string[];
  onUnitDone: (stamp: string) => void;
  onOpenBillboard: (phrase: Phrase) => void;
}

/**
 * 배우기 탭 — 앱의 첫 화면.
 *
 * 화면은 둘뿐입니다: 단원 목록, 그리고 단원 하나.
 * 나라는 헤더 선택을 그대로 따릅니다 — 배우기 안에 또 나라 선택을 두면
 * 헤더와 어긋났을 때 어느 쪽이 맞는지 알 수 없게 됩니다.
 */
export const LearnTab: React.FC<LearnTabProps> = ({
  country,
  speed,
  savedIds,
  onToggleSave,
  progress,
  onMarkSeen,
  unitDone,
  onUnitDone,
  onOpenBillboard,
}) => {
  const [openUnitId, setOpenUnitId] = useState<VocabUnitId | null>(null);

  // 나라를 바꾸면 단원 목록으로 돌아갑니다 — 열려 있던 단원의 내용이
  // 통째로 다른 언어로 바뀌는 것은 화면 전환이라기보다 사고에 가깝습니다.
  useEffect(() => {
    setOpenUnitId(null);
  }, [country.id]);

  const unit = VOCAB_UNITS.find((u) => u.id === openUnitId);

  return (
    <div className="animate-in fade-in duration-150">
      {unit ? (
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
      ) : (
        <UnitList
          country={country}
          progress={progress}
          unitDone={unitDone}
          onOpenUnit={setOpenUnitId}
        />
      )}
    </div>
  );
};
