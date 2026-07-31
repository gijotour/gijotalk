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
import { isBrowserOnline, isKakaoTalk } from '../utils/pwa';
import {
  ITINERARY_TEMPLATE_FILE,
  ITINERARY_XLSX_TEMPLATE_FILE,
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
import { looksLikeXlsx, xlsxToItineraryText } from '../utils/itineraryXlsx';
import {
  clearItineraryLink,
  readItineraryLink,
  readSheetLink,
  decodeItineraryPayload,
} from '../utils/itineraryLink';
import {
  SheetRef,
  parseSheetUrl,
  sheetHomeUrl,
  sheetToItineraryText,
} from '../utils/itinerarySheet';
import { GuideEditorModal } from './GuideEditorModal';
import {
  CalendarDays,
  Download,
  FileUp,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
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
  Sparkles,
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
  스파: <Sparkles className="w-3.5 h-3.5" />,
  기타: <Clock className="w-3.5 h-3.5" />,
};

/**
 * 종류별 색 띠.
 * 목록을 훑을 때 글자를 읽기 전에 "밥/이동/투어" 가 먼저 잡히게 합니다.
 * 흔들리는 차 안에서 보는 화면이라 색이 곧 속도입니다.
 */
const KIND_BAR: Record<ItineraryKind, string> = {
  집합: 'bg-rose-400',
  항공: 'bg-sky-400',
  이동: 'bg-violet-400',
  식사: 'bg-amber-400',
  투어: 'bg-emerald-400',
  숙소: 'bg-indigo-400',
  쇼핑: 'bg-pink-400',
  자유: 'bg-slate-300',
  스파: 'bg-teal-400',
  기타: 'bg-slate-300',
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
  const [pasteText, setPasteText] = useState('');
  const [syncing, setSyncing] = useState(false);
  // 링크로 들어온 경우, 푸는 동안 "일정표가 없습니다" 화면이 깜빡이지 않게 합니다.
  const [receivingLink, setReceivingLink] = useState(
    () => readItineraryLink() !== null || readSheetLink() !== null
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const now = useMemo(() => tripNow(), []);

  // 시트 연결 링크로 들어왔거나, 이미 시트에 연결된 일정표가 있으면 최신 내용을 받아옵니다.
  //
  // 이것이 시트 방식의 존재 이유입니다 — 가이드가 시트를 고치면 여행자는 앱을 열기만
  // 하면 됩니다. 오프라인이면 조용히 건너뛰고 저장해 둔 내용을 그대로 씁니다.
  useEffect(() => {
    const linked = readSheetLink();
    const ref = parseSheetUrl(linked ?? itinerary?.sheetUrl ?? '');
    if (!ref) return;

    const controller = new AbortController();
    const isFirstLoad = Boolean(linked);

    (async () => {
      if (!isFirstLoad && !isBrowserOnline()) return;
      setSyncing(true);
      try {
        await loadFromSheet(ref, controller.signal);
        setError(null);
      } catch (e: unknown) {
        if (controller.signal.aborted) return;
        // 이미 저장된 일정표가 있으면 조용히 넘어갑니다. 현지에서 신호가 약할 때
        // 멀쩡히 보이던 일정 위에 빨간 오류를 띄우면 안 됩니다.
        if (isFirstLoad || !itinerary) {
          setError(e instanceof Error ? e.message : '시트를 읽지 못했습니다.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setSyncing(false);
          setReceivingLink(false);
          if (linked) clearItineraryLink();
        }
      }
    })();

    return () => controller.abort();
    // 마운트 시 한 번만. itinerary 를 의존성에 넣으면 저장할 때마다 다시 받아옵니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  /** 파일이든 붙여넣기든 시트든, 들어온 글자를 읽어 저장하는 한 곳 */
  const acceptText = (text: string, extra?: Partial<Itinerary>): boolean => {
    const result = parseItinerary(text);
    if (!result.itinerary) {
      setError(result.error ?? '일정표를 읽지 못했습니다.');
      return false;
    }
    const next = { ...result.itinerary, ...extra };
    saveItinerary(next);
    setItinerary(next);
    setSelectedDate(null); // 오늘 날짜로 다시 맞춥니다
    setWarnings(result.warnings);
    return true;
  };

  /** 구글시트에서 최신 내용을 받아 저장합니다. */
  const loadFromSheet = async (ref: SheetRef, signal?: AbortSignal): Promise<boolean> => {
    const text = await sheetToItineraryText(ref, signal);
    return acceptText(text, {
      sheetUrl: sheetHomeUrl(ref),
      syncedAt: new Date().toISOString(),
    });
  };

  const handlePaste = async () => {
    setError(null);
    setWarnings([]);

    // 가이드가 우리 링크 대신 구글시트 주소를 그대로 카톡에 붙여넣는 일이 훨씬
    // 흔합니다. 그 주소를 붙여넣어도 바로 연결되게 합니다.
    const ref = parseSheetUrl(pasteText);
    if (ref) {
      setSyncing(true);
      try {
        if (await loadFromSheet(ref)) setPasteText('');
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : '시트를 읽지 못했습니다.');
      } finally {
        setSyncing(false);
      }
      return;
    }

    if (acceptText(pasteText)) setPasteText('');
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setWarnings([]);

    if (file.size > MAX_FILE_BYTES) {
      setError('일정표 파일이 아닌 것 같습니다. (파일이 너무 큽니다)');
      return;
    }

    try {
      // 엑셀인지 텍스트인지는 확장자가 아니라 파일 앞머리를 보고 정합니다 —
      // 카톡·안드로이드를 거치면서 확장자나 MIME 이 바뀌는 일이 잦습니다.
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (looksLikeXlsx(bytes)) {
        acceptText(await xlsxToItineraryText(bytes));
      } else {
        acceptText(new TextDecoder().decode(bytes));
      }
    } catch (e: unknown) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : '파일을 읽지 못했습니다. 받은 파일을 그대로 올려주세요.'
      );
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

  // accept 를 걸지 않습니다.
  //
  //   안드로이드 파일 선택기는 확장자가 아니라 MIME 으로 거릅니다. 그런데 카카오톡이
  //   넘겨주는 파일은 MIME 이 application/octet-stream 인 경우가 많아,
  //   accept=".txt,text/plain" 을 걸면 정작 우리가 받아야 할 파일이 회색으로
  //   비활성화돼 아예 고를 수가 없습니다. 실제로 안드로이드에서 막혔습니다.
  //
  //   어차피 파일 형식은 첫 줄(#기조톡일정)로 내용을 보고 판별하므로,
  //   선택기에서 미리 거르는 것은 편의일 뿐입니다. 편의가 기능을 막으면 버립니다.
  const fileInput = (
    <input
      ref={inputRef}
      type="file"
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
          <p className="text-xs text-ink-mute font-medium">
            받으신 엑셀(.xlsx) 또는 텍스트(.txt) 파일을 그대로 고르세요
          </p>
        </label>

        {/* 파일 선택기가 말을 안 들을 때의 확실한 우회로.
            카톡에서 받은 파일이 안 보이거나 회색이면 여기로 오면 됩니다 —
            메시지를 길게 눌러 복사한 뒤 붙여넣기만 하면 똑같이 동작합니다. */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900">
            구글시트 주소를 받으셨거나, 파일이 안 보이나요?
          </h3>
          <p className="text-xs text-ink-soft font-medium leading-relaxed">
            <span className="font-bold text-brand">구글시트 주소</span>를 붙여넣으면 연결됩니다 —
            이후 가이드가 시트를 고치면 앱을 열 때마다 자동으로 최신 일정이 됩니다. 일정표 내용을
            복사해 붙여넣어도 똑같이 저장됩니다. 파일로 받으셨다면 카톡에서 먼저{' '}
            <span className="font-bold">저장</span>을 눌러 휴대폰에 내려받은 뒤 위에서 골라주세요.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            aria-label="일정표 붙여넣기"
            spellCheck={false}
            placeholder={'https://docs.google.com/spreadsheets/…\n\n또는\n\n#기조톡일정 v1\n제목: …'}
            className="w-full h-28 bg-canvas border-2 border-slate-200 rounded-2xl p-3 text-xs font-mono text-ink placeholder-ink-mute focus:outline-none focus:border-brand-vivid resize-y"
          />
          <button
            onClick={handlePaste}
            disabled={!pasteText.trim() || syncing}
            className="w-full py-3 bg-ink text-white text-xs font-bold rounded-xl active:scale-95 transition-all disabled:opacity-40 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {syncing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {syncing
              ? '시트를 읽는 중…'
              : parseSheetUrl(pasteText)
                ? '구글시트 연결하기'
                : '붙여넣은 내용으로 저장'}
          </button>
        </div>

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
            양식을 받아 내용만 바꿔 저장한 뒤 카톡·텔레그램으로 보내주세요. 정해진 양식으로 적힌
            파일만 열립니다.
          </p>
          {/* 엑셀을 앞에 둡니다 — 여행사 일정표는 원래 엑셀로 만들고,
              칸이 곧 화면이라 배울 게 없습니다. 게다가 .xlsx 안은 항상 UTF-8 이라
              메모장이 한글을 깨뜨리는 사고가 아예 일어나지 않습니다. */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`${BASE_URL}${ITINERARY_XLSX_TEMPLATE_FILE}`}
              download="기조톡_일정표_양식.xlsx"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand text-white text-xs font-bold rounded-xl active:scale-95 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              엑셀 양식 받기
            </a>
            <a
              href={`${BASE_URL}${ITINERARY_TEMPLATE_FILE}`}
              download="기조톡_일정표_양식.txt"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-ink text-xs font-bold rounded-xl active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              텍스트 양식
            </a>
          </div>
          <p className="text-xs text-ink-mute font-medium leading-relaxed">
            엑셀은 [일정] 시트의 칸만 채우면 됩니다. 날짜와 일차는 그날 첫 줄에만 적으면 아래로
            이어집니다.
          </p>
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
      {/* 머리말 — 한 줄로 접어둡니다.
          제목·기간·연결상태는 한 번 확인하면 끝인데, 카드로 두면 매번 오늘 일정을
          화면 밖으로 밀어냅니다. 주인공은 일정입니다. */}
      <div className="flex items-center gap-2 px-1">
        <CalendarDays className="w-4 h-4 text-brand shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold text-slate-900 truncate">{itinerary.title}</p>
          <p className="text-xs text-ink-mute font-bold truncate">
            {itinerary.period}
            {itinerary.sheetUrl && (
              <span className="text-emerald-700">
                {itinerary.period ? ' · ' : ''}
                {syncing ? '갱신 중…' : '시트 자동갱신'}
              </span>
            )}
          </p>
        </div>
        {syncing && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700 shrink-0" />}
        <button
          onClick={handleRemove}
          aria-label="저장된 일정표 지우기"
          className="p-1.5 text-ink-mute hover:text-alert rounded-full shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 특이사항 — 기본은 한 줄 띠. 눈에는 띄되 일정을 밀어내지 않습니다. */}
      {itinerary.notices.length > 0 && (
        <div className="bg-accent/20 border border-accent/60 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowAllNotices((v) => !v)}
            aria-expanded={showAllNotices}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-left"
          >
            <AlertTriangle className="w-4 h-4 text-alert shrink-0" />
            <span className="text-xs font-extrabold text-slate-900 flex-1">
              특이사항 {itinerary.notices.length}건
            </span>
            <span className="text-xs font-bold text-alert">
              {showAllNotices ? '접기' : '보기'}
            </span>
          </button>

          {showAllNotices && (
            <ul className="px-3.5 pb-3 space-y-1.5">
              {itinerary.notices.map((notice, i) => (
                <li key={i} className="text-xs font-bold text-slate-800 leading-relaxed flex gap-2">
                  <span className="text-alert shrink-0">•</span>
                  <span>
                    <NoteText text={notice} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 연락처 — 한 줄로 눕히고 옆으로 밉니다. 6개가 넘어도 두 줄을 먹지 않습니다. */}
      {itinerary.contacts.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {itinerary.contacts.map((c, i) =>
            c.phone ? (
              <a
                key={i}
                href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-ink active:scale-95 transition-all"
              >
                <Phone className="w-3 h-3 text-brand" />
                {c.label}
              </a>
            ) : (
              <span
                key={i}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-ink-soft"
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

      {/* 다음 일정 — 한 줄. 내용은 아래 카드에 이미 있으므로 여기서는 "어디로 가면 되는지"만
          알려주고, 누르면 그 카드로 데려갑니다. 하루 끝 무렵이면 한참 아래에 있습니다. */}
      {nextItem && (
        <button
          onClick={() =>
            document
              .getElementById('gijo-next-item')
              ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
          className="w-full flex items-center gap-2 bg-ink text-white px-4 py-2.5 rounded-2xl shadow-xs active:scale-[0.98] transition-all text-left"
        >
          <Clock className="w-4 h-4 shrink-0 text-accent" />
          <span className="text-xs font-bold text-accent shrink-0">
            {formatCountdown(now.minutes, nextItem.minutes as number)}
          </span>
          <span className="text-xs font-extrabold truncate flex-1">
            {nextItem.time?.split('~')[0].trim()} {nextItem.title}
          </span>
        </button>
      )}

      {/* 하루 일정 */}
      {selectedDay && (
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-900 px-1">{selectedDay.label}</h3>

          {selectedDay.items.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border-2 border-slate-100 shadow-xs">
              <p className="text-xs text-ink-soft font-bold">이 날은 적힌 일정이 없습니다.</p>
            </div>
          ) : (
            selectedDay.items.map((item, i) => {
              const category = KIND_TO_CATEGORY[item.kind];
              const isPast = isToday && typeof item.minutes === 'number' && item.minutes < now.minutes;
              // 지금 향해 가고 있는 일정. 흔들리는 차 안에서 훑을 때 여기부터 눈에 걸려야 합니다.
              const isNext = nextItem === item;

              return (
                <div
                  key={i}
                  id={isNext ? 'gijo-next-item' : undefined}
                  className={`relative bg-white pl-5 pr-4 py-4 rounded-2xl border-2 overflow-hidden transition-all scroll-mt-4 ${
                    isNext
                      ? 'border-brand shadow-md ring-2 ring-brand/20'
                      : 'border-slate-100 shadow-xs'
                  } ${isPast ? 'opacity-50' : ''}`}
                >
                  {/* 종류별 색 띠 — 목록을 훑을 때 글자를 읽기 전에 종류가 먼저 보입니다 */}
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${KIND_BAR[item.kind]}`}
                  />

                  <div className="flex items-start gap-3">
                    {/* 시간 — 일정표에서 가장 먼저 찾는 정보라 가장 크게 둡니다 */}
                    <div className="shrink-0 w-16">
                      <span
                        className={`block text-sm font-black leading-tight ${
                          isNext ? 'text-brand' : 'text-slate-900'
                        }`}
                      >
                        {item.time?.split('~')[0].trim() || '—'}
                      </span>
                      {item.time?.includes('~') && (
                        <span className="block text-xs font-bold text-ink-mute leading-tight">
                          ~{item.time.split('~')[1].trim()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-ink-soft text-xs font-bold rounded-lg">
                          {KIND_ICON[item.kind]}
                          {item.kind}
                        </span>
                        {isNext && (
                          <span className="px-2 py-0.5 bg-brand text-white text-xs font-bold rounded-lg">
                            다음 · {formatCountdown(now.minutes, item.minutes as number)}
                          </span>
                        )}
                        {/* 신청자만 가는 일정 — 확정 일정과 섞이면 안 갈 곳에 나가게 됩니다 */}
                        {item.optional && (
                          <span className="px-2 py-0.5 bg-accent/40 text-alert text-xs font-bold rounded-lg">
                            옵션 · 신청자만
                          </span>
                        )}
                      </div>

                      <p className="text-base font-extrabold text-slate-900 leading-snug">
                        {item.title}
                      </p>

                      {item.place && (
                        <p className="text-sm text-ink-soft font-bold mt-1 break-words">
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
