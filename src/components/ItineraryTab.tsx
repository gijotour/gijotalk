import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CategoryId,
  Country,
  Itinerary,
  ItineraryItem,
  ItineraryKind,
  Phrase,
} from '../types';
import { BASE_URL } from '../utils/env';
import { isKakaoTalk } from '../utils/pwa';
import {
  ITINERARY_TEMPLATE_FILE,
  KIND_TO_CATEGORY,
  clearItinerary,
  findNextItem,
  formatCountdown,
  loadItinerary,
  parseItinerary,
  saveItinerary,
  shortDate,
  splitPhones,
  tripNow,
} from '../utils/itinerary';
import {
  clearItineraryLink,
  readItineraryLink,
  decodeItineraryPayload,
} from '../utils/itineraryLink';
import { GuideEditorModal } from './GuideEditorModal';
import {
  CalendarDays,
  Download,
  FileUp,
  Loader2,
  PencilLine,
  AlertCircle,
  AlertTriangle,
  Trash2,
  Phone,
  Maximize2,
  MessageSquareQuote,
  Clock,
  Plane,
  Bus,
  Utensils,
  BedDouble,
  ShoppingBag,
  Users,
  Camera,
  Coffee,
} from 'lucide-react';

interface ItineraryTabProps {
  country: Country;
  /** 장소를 전광판으로 띄웁니다 — 기사에게 폰을 그대로 보여주는 용도 */
  onOpenBillboard: (phrase: Phrase) => void;
  /** 관련 회화 카테고리로 이동 */
  onJumpToCategory: (category: CategoryId) => void;
}

/** 파일이 아무리 커도 일정표가 이 이상일 수는 없습니다. 잘못된 파일을 일찍 끊습니다. */
const MAX_FILE_BYTES = 512 * 1024;

const KIND_ICON: Record<ItineraryKind, React.ReactNode> = {
  집합: <Users className="w-3.5 h-3.5" />,
  항공: <Plane className="w-3.5 h-3.5" />,
  이동: <Bus className="w-3.5 h-3.5" />,
  식사: <Utensils className="w-3.5 h-3.5" />,
  투어: <Camera className="w-3.5 h-3.5" />,
  숙소: <BedDouble className="w-3.5 h-3.5" />,
  쇼핑: <ShoppingBag className="w-3.5 h-3.5" />,
  자유: <Coffee className="w-3.5 h-3.5" />,
  기타: <Clock className="w-3.5 h-3.5" />,
};

/** 메모에 적힌 전화번호를 눌러서 걸 수 있게 바꿉니다 (호텔 프런트·기사 번호). */
const NoteText: React.FC<{ text: string }> = ({ text }) => (
  <>
    {splitPhones(text).map((part, i) =>
      part.phone ? (
        <a key={i} href={`tel:${part.phone}`} className="underline underline-offset-2">
          {part.text}
        </a>
      ) : (
        <React.Fragment key={i}>{part.text}</React.Fragment>
      )
    )}
  </>
);

/**
 * 일정표 탭.
 *
 * 가이드가 정해진 양식(.txt)으로 적어 카톡·텔레그램으로 보내면, 여행자는 그 파일
 * 하나만 여기에 올립니다. 한 번 읽으면 기기에 남아 이후로는 오프라인에서 열립니다 —
 * 파싱은 출국 전 한 번, 조회는 현지에서 수십 번이라는 비대칭이 설계의 중심입니다.
 */
export const ItineraryTab: React.FC<ItineraryTabProps> = ({
  country,
  onOpenBillboard,
  onJumpToCategory,
}) => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(() => loadItinerary());
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showGuideEditor, setShowGuideEditor] = useState(false);
  const [showAllNotices, setShowAllNotices] = useState(false);
  // 링크로 들어온 경우, 푸는 동안 "일정표가 없습니다" 화면이 깜빡이지 않게 합니다.
  const [receivingLink, setReceivingLink] = useState(() => readItineraryLink() !== null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const now = useMemo(() => tripNow(), []);

  // 카톡방에 붙여넣은 링크로 들어온 경우 — 파일을 고를 필요 없이 바로 저장됩니다.
  useEffect(() => {
    const payload = readItineraryLink();
    if (!payload) return;

    let cancelled = false;
    (async () => {
      try {
        const text = await decodeItineraryPayload(payload);
        const result = parseItinerary(text);
        if (cancelled) return;

        if (!result.itinerary) {
          setError(result.error ?? '링크의 일정표를 읽지 못했습니다.');
        } else {
          saveItinerary(result.itinerary);
          setItinerary(result.itinerary);
          setSelectedDate(null);
          setWarnings(result.warnings);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '링크의 일정표를 읽지 못했습니다.');
        }
      } finally {
        if (!cancelled) {
          setReceivingLink(false);
          // 주소를 정리합니다. 남겨두면 수천 자짜리 주소가 계속 따라다닙니다.
          clearItineraryLink();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 처음 열 때 오늘 날짜로 맞춥니다. 여행 기간 밖이면 첫날을 보여줍니다.
  useEffect(() => {
    if (!itinerary || selectedDate) return;
    const hasToday = itinerary.days.some((d) => d.date === now.date);
    setSelectedDate(hasToday ? now.date : itinerary.days[0]?.date ?? null);
  }, [itinerary, selectedDate, now.date]);

  const selectedDay = useMemo(
    () => itinerary?.days.find((d) => d.date === selectedDate),
    [itinerary, selectedDate]
  );

  const isToday = selectedDay?.date === now.date;
  const nextItem = useMemo(
    () => (isToday ? findNextItem(selectedDay, now.minutes) : undefined),
    [isToday, selectedDay, now.minutes]
  );

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setWarnings([]);

    if (file.size > MAX_FILE_BYTES) {
      setError('일정표 파일이 아닌 것 같습니다. (파일이 너무 큽니다)');
      return;
    }

    try {
      const text = await file.text();
      const result = parseItinerary(text);

      if (!result.itinerary) {
        setError(result.error ?? '파일을 읽지 못했습니다.');
        return;
      }

      saveItinerary(result.itinerary);
      setItinerary(result.itinerary);
      setSelectedDate(null); // 오늘 날짜로 다시 맞춥니다
      setWarnings(result.warnings);
    } catch {
      setError('파일을 읽지 못했습니다. 받은 .txt 파일 그대로 올려주세요.');
    } finally {
      // 같은 파일을 다시 골라도 change 가 뜨게 비웁니다.
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    if (!window.confirm('저장된 일정표를 지울까요? 받은 파일을 다시 올리면 복구됩니다.')) return;
    clearItinerary();
    setItinerary(null);
    setSelectedDate(null);
    setWarnings([]);
  };

  /** 장소를 전광판에 띄우기 위한 임시 문장. 회화집에 저장되지는 않습니다. */
  const placePhrase = (item: ItineraryItem): Phrase => ({
    id: `itinerary-place-${item.place}`,
    countryId: country.id,
    category: '교통',
    original: item.place ?? '',
    translation: item.title,
    pronunciation: '',
    usageTip: '이 화면을 기사에게 그대로 보여주세요.',
  });

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept=".txt,text/plain"
      className="sr-only"
      id="gijo-itinerary-input"
      onChange={(e) => handleFile(e.target.files?.[0])}
    />
  );

  /** 가이드 모드 진입 — 눈에 띄되 여행자가 실수로 누를 만큼 크지는 않게 둡니다. */
  const guideEntry = (
    <button
      onClick={() => setShowGuideEditor(true)}
      className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-ink-mute hover:text-brand transition-colors"
    >
      <PencilLine className="w-3.5 h-3.5" />
      가이드용 · 일정표 직접 작성하기
    </button>
  );

  const guideEditor = showGuideEditor && (
    <GuideEditorModal
      initialText={itinerary?.source}
      onClose={() => setShowGuideEditor(false)}
      onSave={(next) => {
        saveItinerary(next);
        setItinerary(next);
        setSelectedDate(null);
        setWarnings([]);
        setError(null);
        setShowGuideEditor(false);
      }}
    />
  );

  /* ---------------------------------------------------------------- */
  /* 링크로 받는 중                                                     */
  /* ---------------------------------------------------------------- */
  if (receivingLink) {
    return (
      <div className="py-16 flex flex-col items-center gap-3 text-ink-soft animate-in fade-in duration-150">
        <Loader2 className="w-7 h-7 animate-spin text-brand" />
        <p className="text-sm font-bold">일정표를 받는 중…</p>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* 아직 일정표가 없을 때                                              */
  /* ---------------------------------------------------------------- */
  if (!itinerary) {
    return (
      <div className="space-y-4 animate-in fade-in duration-150">
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-brand" />
            <span>내 일정표</span>
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-0.5">
            카톡·텔레그램으로 받은 일정표 파일을 올리면 인터넷 없이도 계속 볼 수 있습니다
          </p>
        </div>

        {fileInput}
        <label
          htmlFor="gijo-itinerary-input"
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 rounded-2xl py-12 cursor-pointer hover:border-brand hover:bg-brand-tint transition-colors bg-white"
        >
          <div className="p-4 bg-brand text-white rounded-2xl">
            <FileUp className="w-7 h-7" />
          </div>
          <p className="text-sm font-bold text-ink">일정표 파일 올리기</p>
          <p className="text-xs text-ink-mute font-medium">받으신 .txt 파일을 그대로 고르세요</p>
        </label>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 카카오톡 인앱 브라우저는 파일 선택이 막히거나 저장이 날아갑니다.
            하필 일정표를 카톡으로 받는 기능이라 여기가 최대 실패 지점입니다. */}
        {isKakaoTalk() && (
          <div className="p-3 bg-accent/20 border border-accent rounded-2xl flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-alert shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-ink leading-relaxed">
              지금 카카오톡 안에서 보고 있어 파일 선택이 막힐 수 있습니다. 오른쪽 아래 메뉴에서
              <span className="mx-1 px-1.5 py-0.5 bg-white rounded">다른 브라우저로 열기</span>
              를 눌러 사파리·크롬으로 여신 뒤 올려주세요.
            </p>
          </div>
        )}

        {/* 가이드용 — 이 양식으로 적어서 보내면 됩니다 */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900">일정표를 보내시는 분께</h3>
          <p className="text-xs text-ink-soft font-medium leading-relaxed">
            아래 양식 파일을 받아 메모장으로 열고 내용만 바꿔 저장한 뒤, 카톡·텔레그램으로
            보내주세요. 정해진 양식으로 적힌 .txt 파일만 열립니다.
          </p>
          <a
            href={`${BASE_URL}${ITINERARY_TEMPLATE_FILE}`}
            download="기조톡_일정표_양식.txt"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-white text-xs font-bold rounded-xl active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            일정표 양식 받기
          </a>
        </div>

        <p className="text-xs text-ink-mute font-medium leading-relaxed px-1">
          올린 일정표는 이 기기에만 저장됩니다. 서버로 보내지 않습니다.
        </p>

        {guideEntry}
        {guideEditor}
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* 일정표 보기                                                        */
  /* ---------------------------------------------------------------- */
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* 제목 · 기간 */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-brand shrink-0" />
              <span className="truncate">{itinerary.title}</span>
            </h2>
            {itinerary.period && (
              <p className="text-xs text-slate-500 font-bold mt-0.5">{itinerary.period}</p>
            )}
          </div>
          <button
            onClick={handleRemove}
            aria-label="저장된 일정표 지우기"
            className="p-2 text-ink-mute hover:text-alert rounded-full bg-slate-100 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 특이사항 — 일정 스크롤에 묻히면 안 되는 것들이라 항상 위에 둡니다 */}
      {itinerary.notices.length > 0 && (
        <div className="bg-accent/20 border-2 border-accent/60 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-alert" />
            <h3 className="font-extrabold text-xs text-slate-900">특이사항</h3>
          </div>
          {/* 특이사항이 8건씩 되면 정작 오늘 일정이 화면 밖으로 밀려납니다.
              중요하지만 매번 다 읽을 것은 아니므로 3건만 펼쳐둡니다. */}
          <ul className="space-y-1.5">
            {(showAllNotices ? itinerary.notices : itinerary.notices.slice(0, 3)).map(
              (notice, i) => (
                <li key={i} className="text-xs font-bold text-slate-800 leading-relaxed flex gap-2">
                  <span className="text-alert shrink-0">•</span>
                  <span>
                    <NoteText text={notice} />
                  </span>
                </li>
              )
            )}
          </ul>

          {itinerary.notices.length > 3 && (
            <button
              onClick={() => setShowAllNotices((v) => !v)}
              className="mt-2 text-xs font-bold text-alert underline underline-offset-2"
            >
              {showAllNotices
                ? '접기'
                : `${itinerary.notices.length - 3}건 더 보기`}
            </button>
          )}
        </div>
      )}

      {/* 연락처 — 현지에서 바로 걸 수 있게 tel: 로 겁니다 */}
      {itinerary.contacts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {itinerary.contacts.map((c, i) =>
            c.phone ? (
              <a
                key={i}
                href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-slate-100 rounded-xl text-xs font-bold text-ink shadow-xs active:scale-95 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-brand" />
                {c.label}
              </a>
            ) : (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-slate-100 rounded-xl text-xs font-bold text-ink-soft shadow-xs"
              >
                {c.label}
              </span>
            )
          )}
        </div>
      )}

      {/* 날짜 칩 */}
      {itinerary.days.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {itinerary.days.map((day) => {
            const active = day.date === selectedDate;
            const today = day.date === now.date;
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all active:scale-95 ${
                  active
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-ink-soft border-slate-100'
                }`}
              >
                {shortDate(day.date)}
                {today && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 rounded-lg ${
                      active ? 'bg-white/25' : 'bg-accent/40 text-alert'
                    }`}
                  >
                    오늘
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 다음 일정 — 오늘을 보고 있을 때만 */}
      {nextItem && (
        <div className="bg-ink text-white p-4 rounded-2xl shadow-xs">
          <p className="text-xs font-bold text-white/60">
            다음 일정 · {formatCountdown(now.minutes, nextItem.minutes as number)}
          </p>
          <p className="text-sm font-extrabold mt-1">
            {nextItem.time} {nextItem.title}
          </p>
          {nextItem.note && (
            <p className="text-xs font-bold text-accent mt-1">💡 {nextItem.note}</p>
          )}
        </div>
      )}

      {/* 하루 일정 */}
      {selectedDay && (
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 px-1">{selectedDay.label}</h3>

          {selectedDay.items.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border-2 border-slate-100 shadow-xs">
              <p className="text-xs text-ink-soft font-bold">이 날은 적힌 일정이 없습니다.</p>
            </div>
          ) : (
            selectedDay.items.map((item, i) => {
              const category = KIND_TO_CATEGORY[item.kind];
              const isPast = isToday && typeof item.minutes === 'number' && item.minutes < now.minutes;

              return (
                <div
                  key={i}
                  className={`bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs ${
                    isPast ? 'opacity-55' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* 시간 */}
                    <div className="shrink-0 w-14 text-center">
                      <span className="text-xs font-black text-brand">{item.time || '—'}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-ink-soft text-xs font-bold rounded-lg">
                          {KIND_ICON[item.kind]}
                          {item.kind}
                        </span>
                        {/* 신청자만 가는 일정 — 확정 일정과 섞이면 안 갈 곳에 나가게 됩니다 */}
                        {item.optional && (
                          <span className="px-2 py-0.5 bg-accent/40 text-alert text-xs font-bold rounded-lg">
                            옵션 · 신청자만
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-extrabold text-slate-900 leading-snug">
                        {item.title}
                      </p>

                      {item.place && (
                        <p className="text-xs text-ink-soft font-bold mt-0.5 break-words">
                          📍 {item.place}
                        </p>
                      )}

                      {item.note && (
                        <p className="text-xs text-alert font-bold mt-1.5">
                          💡 <NoteText text={item.note} />
                        </p>
                      )}

                      {/* 현장 동작 — 여기가 이 앱 안에 일정표가 있어야 하는 이유입니다 */}
                      {(item.place || category) && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.place && (
                            <button
                              onClick={() => onOpenBillboard(placePhrase(item))}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-ink text-white text-xs font-bold rounded-xl active:scale-95 transition-all"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              기사에게 보여주기
                            </button>
                          )}
                          {category && (
                            <button
                              onClick={() => onJumpToCategory(category)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-tint text-brand text-xs font-bold rounded-xl active:scale-95 transition-all"
                            >
                              <MessageSquareQuote className="w-3.5 h-3.5" />
                              {category} 회화
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 못 읽은 줄 — 방금 올린 직후에만 보여줍니다 */}
      {warnings.length > 0 && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
          <p className="text-xs font-bold text-ink-soft">
            읽지 못해 건너뛴 줄이 {warnings.length}개 있습니다.
          </p>
          {warnings.slice(0, 5).map((w, i) => (
            <p key={i} className="text-xs text-ink-mute font-medium break-words">
              {w}
            </p>
          ))}
        </div>
      )}

      {/* 다시 올리기 */}
      {fileInput}
      <label
        htmlFor="gijo-itinerary-input"
        className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer text-xs font-bold text-ink-soft hover:border-brand hover:text-brand transition-colors"
      >
        <FileUp className="w-4 h-4" />
        새 일정표 파일로 바꾸기
      </label>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {guideEntry}
      {guideEditor}
    </div>
  );
};
