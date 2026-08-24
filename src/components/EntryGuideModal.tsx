import React, { useState } from 'react';
import { Country } from '../types';
import { Modal } from './Modal';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Plane,
  Clock,
  ShieldCheck,
  Building,
  Smartphone,
  Luggage,
} from 'lucide-react';

interface EntryGuideModalProps {
  country: Country;
  onClose: () => void;
}

type GuideTab = 'ph' | 'vn';

export const EntryGuideModal: React.FC<EntryGuideModalProps> = ({
  country,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<GuideTab>(
    country.id === 'vn' ? 'vn' : 'ph'
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 text-white rounded-xl">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              입국심사 & 필수 서류 가이드
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              공항 심사대 통과 완벽 체크리스트
            </p>
          </div>
        </div>
      }
      ariaLabel="입국심사 및 필수 서류 가이드"
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-4 text-xs">
        {/* 국가 전환 탭 */}
        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('ph')}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-xs ${
              activeTab === 'ph'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-base">🇵🇭</span>
            <span>필리핀 (세부/보라카이/마닐라)</span>
          </button>
          <button
            onClick={() => setActiveTab('vn')}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-xs ${
              activeTab === 'vn'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-base">🇻🇳</span>
            <span>베트남 (다낭/나트랑/푸꾸옥)</span>
          </button>
        </div>

        {/* ======================= 필리핀 가이드 ======================= */}
        {activeTab === 'ph' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* 핵심 요약 배너 */}
            <div className="bg-blue-50 border-2 border-blue-200 p-3.5 rounded-2xl text-blue-950 space-y-1">
              <div className="flex items-center gap-1.5 font-black text-blue-800 text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>필리핀 입국 핵심 4대 필수 준비물</span>
              </div>
              <p className="text-xs text-blue-900/80 leading-relaxed font-medium">
                1) <strong>e-Travel QR코드</strong> &nbsp;2) <strong>여권 6개월 이상</strong> &nbsp;3) <strong>왕복 E-티켓</strong> &nbsp;4) <strong>호텔 바우처</strong>
              </p>
            </div>

            {/* 체크리스트 상세 */}
            <div className="space-y-2.5">
              <div className="bg-white border-2 border-slate-100 p-3.5 rounded-2xl shadow-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="font-extrabold text-slate-900 text-xs">
                    1. e-Travel (전자입국신고서) 등록 필수
                  </h3>
                </div>
                <p className="text-slate-600 text-xs pl-6 leading-relaxed">
                  항공기 탑승 전 <strong>72시간 이내</strong>에 공식 사이트에서 무료 등록하고, 완료 후 발급되는 <strong>QR코드를 캡처 또는 출력</strong>해 지참하세요. (종이 입국신고서 대체)
                </p>
                <div className="pl-6 pt-1">
                  <a
                    href="https://etravel.gov.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    <span>e-Travel 공식 등록 바로가기 (무료)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-[11px] text-amber-700 mt-1 font-medium">
                    ⚠️ 수수료를 요구하는 사칭 유료 사이트를 주의하세요. e-Travel은 100% 무료입니다.
                  </p>
                </div>
              </div>

              <div className="bg-white border-2 border-slate-100 p-3.5 rounded-2xl shadow-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="font-extrabold text-slate-900 text-xs">
                    2. 여권 유효기간 6개월 이상 & 왕복 항공권
                  </h3>
                </div>
                <ul className="text-slate-600 text-xs pl-6 space-y-1 list-disc list-inside">
                  <li>입국일 기준 <strong>최소 6개월 이상</strong> 남은 여권 필수 (훼손·서명 확인).</li>
                  <li><strong>30일 무비자 체류</strong>: 30일 이내에 한국 또는 제3국으로 나가는 <strong>왕복 항공권(E-티켓)</strong> 필수.</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-slate-100 p-3.5 rounded-2xl shadow-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-amber-600 shrink-0" />
                  <h3 className="font-extrabold text-slate-900 text-xs">
                    3. 세관 및 면세품 주의사항
                  </h3>
                </div>
                <ul className="text-slate-600 text-xs pl-6 space-y-1 list-disc list-inside">
                  <li><strong>면세 한도</strong>: 10,000페소 (약 24만원). 한국 면세점에서 산 고가품은 영수증 및 포장 주의.</li>
                  <li><strong>담배/주류</strong>: 담배 2보루(400개비), 주류 2병(총 1.5L 이하)까지 면세.</li>
                  <li><strong>전자담배</strong>: 필리핀 내 전자담배 반입 및 공공장소 사용 엄격 규제.</li>
                </ul>
              </div>

              {/* 입국심사관 빈출 영어 Q&A */}
              <div className="bg-slate-50 border-2 border-slate-200 p-3.5 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>입국심사대 빈출 질문 & 모범 답변 (영어)</span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-900">Q. "What is the purpose of your visit?" (방문 목적이 무엇인가요?)</p>
                    <p className="text-blue-700 font-extrabold mt-0.5">A. "Vacation / Sightseeing." (관광 / 휴가입니다)</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-900">Q. "How long will you stay?" (얼마나 머무르나요?)</p>
                    <p className="text-blue-700 font-extrabold mt-0.5">A. "For 4 days." (4일 동안 머뭅니다 - 항공권 제시)</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-900">Q. "Where will you stay?" (어디서 숙박하나요?)</p>
                    <p className="text-blue-700 font-extrabold mt-0.5">A. "At [호텔이름] Hotel in Cebu." (호텔 바우처 제시)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= 베트남 가이드 ======================= */}
        {activeTab === 'vn' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* 핵심 요약 배너 */}
            <div className="bg-rose-50 border-2 border-rose-200 p-3.5 rounded-2xl text-rose-950 space-y-1">
              <div className="flex items-center gap-1.5 font-black text-rose-800 text-xs">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>베트남 입국 핵심 4대 필수 준비물</span>
              </div>
              <p className="text-xs text-rose-900/80 leading-relaxed font-medium">
                1) <strong>여권 6개월 이상(훼손 금지)</strong> &nbsp;2) <strong>45일 무비자</strong> &nbsp;3) <strong>왕복 항공권</strong> &nbsp;4) <strong>숙소 정보</strong>
              </p>
            </div>

            {/* 체크리스트 상세 */}
            <div className="space-y-2.5">
              <div className="bg-white border-2 border-slate-100 p-3.5 rounded-2xl shadow-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="font-extrabold text-slate-900 text-xs">
                    1. 대한민국 여권 45일 무비자 체류
                  </h3>
                </div>
                <p className="text-slate-600 text-xs pl-6 leading-relaxed">
                  대한민국 여권 소지자는 <strong>최대 45일까지 무비자</strong>로 베트남 입국이 가능합니다. (45일 초과 체류 시 전자비자 e-Visa 사전 신청 필요)
                </p>
              </div>

              <div className="bg-white border-2 border-slate-100 p-3.5 rounded-2xl shadow-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-alert shrink-0" />
                  <h3 className="font-extrabold text-slate-900 text-xs">
                    2. 여권 훼손 및 낙서 절대 주의 (입국 거부 1순위)
                  </h3>
                </div>
                <ul className="text-slate-600 text-xs pl-6 space-y-1 list-disc list-inside">
                  <li>입국일 기준 <strong>최소 6개월 이상</strong> 유효기간 필수.</li>
                  <li><strong>사증란 낙서, 오염, 페이지 뜯김, 찢김</strong>이 있는 경우 베트남 공항에서 <strong>입국이 거부</strong>되므로 출발 전 반드시 확인하세요!</li>
                  <li>종이 입국신고서는 폐지되어 <strong>작성하지 않습니다.</strong></li>
                </ul>
              </div>

              <div className="bg-white border-2 border-slate-100 p-3.5 rounded-2xl shadow-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="font-extrabold text-slate-900 text-xs">
                    3. 리턴 항공권(E-티켓) & 숙소 예약 확인서
                  </h3>
                </div>
                <ul className="text-slate-600 text-xs pl-6 space-y-1 list-disc list-inside">
                  <li>45일 이내 출국하는 <strong>왕복 항공권</strong> 확인을 요구할 수 있으니 모바일 저장 또는 출력본 지참.</li>
                  <li>첫날 숙박하는 <strong>호텔 바우처</strong> 영문본 소지 권장.</li>
                </ul>
              </div>

              {/* 입국심사관 빈출 영어 Q&A */}
              <div className="bg-slate-50 border-2 border-slate-200 p-3.5 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                  <HelpCircle className="w-4 h-4 text-rose-600" />
                  <span>입국심사대 빈출 질문 & 모범 답변 (영어)</span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-900">Q. "How many days will you stay?" (며칠 머무르나요?)</p>
                    <p className="text-rose-700 font-extrabold mt-0.5">A. "5 days, I have a return ticket." (5일입니다, 왕복표 있습니다)</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-900">Q. "Where are you going?" (어디로 가나요?)</p>
                    <p className="text-rose-700 font-extrabold mt-0.5">A. "Danang / Nha Trang for travel." (다낭 / 나트랑 여행입니다)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 하단 닫기 버튼 */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-xs text-xs transition-colors"
        >
          확인 완료 (닫기)
        </button>
      </div>
    </Modal>
  );
};
