import React from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'banner' | 'card' | 'rectangle';
  className?: string;
}

/**
 * 구글 애드센스 / 애드몹 / 카카오 애드핏 연동용 프리미엄 반응형 광고 슬롯 컴포넌트.
 *
 * 광고 코드가 없을 때도 레이아웃 흔들림(CLS)이 전혀 없도록
 * 세련된 여행 프로모션 배너 스타일의 플레이스홀더를 제공하며,
 * 실제 광고 스크립트(AdSense / AdMob) 주입 시 즉시 실제 광고로 전환됩니다.
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = 'gijo-ad-slot-default',
  format = 'banner',
  className = '',
}) => {
  return (
    <div
      className={`w-full overflow-hidden rounded-2xl transition-all duration-200 ${className}`}
      id={slotId}
    >
      {format === 'banner' && (
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/50 border border-orange-200/80 p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-1.5 py-0.5 bg-orange-200/60 text-orange-900 text-[10px] font-black rounded-md shrink-0">
              AD
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">
                ✈️ 동남아 여행 필수템 & 환전 우대 혜택
              </p>
              <p className="text-[11px] text-slate-500 font-medium truncate hidden sm:block">
                지아이조 투어 여행객을 위한 특별 제휴 프로모션
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-brand hover:underline shrink-0 flex items-center gap-0.5">
            자세히보기 ➔
          </span>
        </div>
      )}

      {format === 'card' && (
        <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl shadow-xs text-center space-y-2">
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
            <span>스폰서 제휴</span>
            <span className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-500">AD</span>
          </div>
          <div className="py-2">
            <p className="text-xs font-extrabold text-slate-900">
              🌴 베트남 & 필리핀 특가 호텔 & 골프 패키지
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              지아이조 투어 회원 단독 최저가 보장 예약
            </p>
          </div>
          <button className="w-full py-2 bg-gradient-to-r from-brand to-orange-500 text-white rounded-xl text-xs font-bold shadow-xs">
            특가 확인하기
          </button>
        </div>
      )}
    </div>
  );
};
