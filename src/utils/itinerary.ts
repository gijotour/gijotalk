// 일정표 파일(.txt) 파싱 · 저장.
//
// ── 왜 AI 가 아니라 고정 양식인가
//   서버 없는 정적 배포라 /api/* 를 부를 수 없습니다. 그래서 "아무 형식이나
//   AI 가 읽어준다" 대신 "가이드가 정해진 양식으로 적는다" 를 택했습니다.
//   덤으로 얻는 것:
//     · 오독이 없습니다 — 적은 대로 나옵니다.
//     · 오프라인에서 파싱됩니다 — 비행기 안에서 올려도 됩니다.
//     · 일정표(실명·항공편·숙소)가 기기 밖으로 한 번도 나가지 않습니다.
//
// ── 파서의 원칙: 절대 통째로 실패하지 않는다
//   현지에서 "파일을 못 읽습니다" 만 뜨면 여행자가 할 수 있는 게 없습니다.
//   못 알아본 줄은 warnings 에 담아 건너뛰고, 읽은 만큼은 반드시 보여줍니다.
//   유일한 치명적 오류는 "이 앱 파일이 아님" 뿐입니다.

import {
  Itinerary,
  ItineraryContact,
  ItineraryDay,
  ItineraryItem,
  ItineraryKind,
  CategoryId,
} from '../types';

/** 파일 첫 줄. 이걸로 "우리 양식 파일"만 통과시킵니다. */
export const ITINERARY_MAGIC = '#기조톡일정';

export const ITINERARY_STORAGE_KEY = 'quickpass_itinerary_v1';

/** 양식 파일 이름 (public/ 에 그대로 놓여 있습니다) */
export const ITINERARY_TEMPLATE_FILE = 'itinerary-template.txt';

/**
 * 여행지 기준 시간대.
 *
 * "오늘 일정" 을 기기 시간으로 계산하면 안 됩니다. 한국(UTC+9)과 필리핀(UTC+8)은
 * 1시간 차이라, 현지 밤 11시에 열면 기기는 이미 다음 날이라 내일 일정을 보여줍니다.
 * 집합 시간을 놓치는 종류의 버그라 시간대를 못박습니다.
 */
export const TRIP_TIMEZONE = 'Asia/Manila';

const KINDS: ItineraryKind[] = [
  '집합', '항공', '이동', '식사', '투어', '숙소', '쇼핑', '자유', '기타',
];
const KIND_SET = new Set<string>(KINDS);

/** 일정 종류 → 회화 카테고리. 없는 종류는 연결할 회화가 마땅치 않습니다. */
export const KIND_TO_CATEGORY: Partial<Record<ItineraryKind, CategoryId>> = {
  항공: '항공',
  숙소: '호텔',
  이동: '교통',
  식사: '식당',
  쇼핑: '흥정',
};

export interface ItineraryParseResult {
  itinerary: Itinerary | null;
  /** 치명적 오류 — 이게 있으면 itinerary 는 null 입니다 */
  error?: string;
  /** 건너뛴 줄들. 읽기는 성공했지만 가이드에게 알려주면 좋은 것들 */
  warnings: string[];
}

/* ------------------------------------------------------------------ */
/* 작은 파서들                                                          */
/* ------------------------------------------------------------------ */

/** "2026-08-01" / "2026.8.1" / "8/1" / "8월 1일 (화)" → "2026-08-01" */
function parseDate(raw: string, fallbackYear: number): string | null {
  // 뒤에 붙는 요일 표기를 떼어냅니다: "8/1 (화)", "8/1 화"
  const s = raw.trim().replace(/[()（）]/g, ' ').replace(/[월화수목금토일]요일?\s*$/, '').trim();

  let year: number;
  let month: number;
  let day: number;

  const full = s.match(/^(\d{4})\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})/);
  if (full) {
    year = Number(full[1]);
    month = Number(full[2]);
    day = Number(full[3]);
  } else {
    const short = s.match(/^(\d{1,2})\s*[.\-/월]\s*(\d{1,2})/);
    if (!short) return null;
    year = fallbackYear;
    month = Number(short[1]);
    day = Number(short[2]);
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** 첫 칸이 시간 칸인지. 아니면 가이드가 시간을 생략하고 바로 내용을 쓴 것으로 봅니다. */
function looksLikeTime(s: string): boolean {
  const t = s.trim();
  if (!t || t === '-') return true;
  if (/오전|오후|AM|PM/i.test(t)) return true;
  if (/^\d{1,2}\s*[:시]/.test(t)) return true;
  if (/^\d{3,4}$/.test(t)) return true; // 0630
  return false;
}

/** "06:30" / "6시 30분" / "오후 2시" / "0630" → 자정 기준 분 */
export function toMinutes(time?: string): number | undefined {
  if (!time) return undefined;
  const t = time.trim();
  if (!t) return undefined;

  const isPM = /오후|PM/i.test(t);
  const isAM = /오전|AM/i.test(t);

  let hour: number;
  let minute: number;

  const colon = t.match(/(\d{1,2})\s*[:시]\s*(\d{1,2})?/);
  if (colon) {
    hour = Number(colon[1]);
    minute = colon[2] ? Number(colon[2]) : 0;
  } else {
    const compact = t.match(/^(\d{2})(\d{2})$/);
    if (!compact) return undefined;
    hour = Number(compact[1]);
    minute = Number(compact[2]);
  }

  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;
  if (hour > 23 || minute > 59) return undefined;
  return hour * 60 + minute;
}

/**
 * 옵션 일정 표기.
 *
 * 여행사 일정표는 이미 "(옵션) 오슬롭 고래상어" 처럼 적고 있습니다.
 * 새 문법을 만들지 않고 그 관행을 그대로 알아듣습니다 — 가이드가 배울 게 없어야 씁니다.
 */
const OPTIONAL_PREFIX = /^[([（【]\s*(옵션|선택|option)\s*[)\]）】]\s*/i;

/** "호텔 체크인 @Bai Hotel Cebu" → { title, place } */
function splitPlace(text: string): { title: string; place?: string } {
  const m = text.match(/^(.*?)\s+@\s*(.+)$/);
  if (!m) return { title: text.trim() };
  const title = m[1].trim();
  const place = m[2].trim();
  // "@" 앞이 비면 장소만 적은 것입니다. 그땐 장소를 제목으로도 씁니다.
  return { title: title || place, place: place || undefined };
}

/** 일정 한 줄:  시간 | 종류 | 내용 | 메모 */
function parseItemLine(line: string): ItineraryItem | null {
  const parts = line.split('|').map((s) => s.trim());

  let time: string | undefined;
  let rest: string[];

  if (parts.length === 1) {
    rest = parts;
  } else if (looksLikeTime(parts[0])) {
    const raw = parts[0].trim();
    time = raw && raw !== '-' ? raw : undefined;
    rest = parts.slice(1);
  } else {
    // 시간 칸을 건너뛰고 바로 내용부터 쓴 줄
    rest = parts;
  }

  let kind: ItineraryKind = '기타';
  let body: string;
  let note: string | undefined;

  if (rest.length >= 2 && KIND_SET.has(rest[0])) {
    kind = rest[0] as ItineraryKind;
    body = rest[1] ?? '';
    note = rest[2];
  } else {
    body = rest[0] ?? '';
    note = rest[1];
  }

  const optional = OPTIONAL_PREFIX.test(body);
  const { title, place } = splitPlace(body.replace(OPTIONAL_PREFIX, ''));
  if (!title) return null;

  return {
    time,
    minutes: toMinutes(time),
    kind,
    title,
    place,
    note: note?.trim() || undefined,
    optional: optional || undefined,
  };
}

/* ------------------------------------------------------------------ */
/* 본 파서                                                             */
/* ------------------------------------------------------------------ */

export function parseItinerary(raw: string): ItineraryParseResult {
  const warnings: string[] = [];

  // BOM 과 윈도우 줄바꿈 — 메모장에서 저장하면 둘 다 붙어 옵니다.
  const source = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const lines = source.split('\n');

  const firstIndex = lines.findIndex((l) => l.trim().length > 0);
  if (firstIndex === -1 || !lines[firstIndex].trim().startsWith(ITINERARY_MAGIC)) {
    return {
      itinerary: null,
      warnings,
      error:
        '기조톡 일정표 파일이 아닙니다. 첫 줄이 "#기조톡일정 v1" 인 .txt 파일만 열 수 있습니다.',
    };
  }

  let title = '';
  let period: string | undefined;
  const contacts: ItineraryContact[] = [];
  const notices: string[] = [];
  const days: ItineraryDay[] = [];

  let mode: 'head' | 'notices' | 'day' = 'head';
  let currentDay: ItineraryDay | null = null;
  let fallbackYear = new Date().getFullYear();

  for (let i = firstIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith('#')) continue; // 설명 줄

    // ── 구역 머리:  [특이사항]  /  [2026-08-01] 1일차 · 출국
    const section = line.match(/^\[([^\]]*)\]\s*(.*)$/);
    if (section) {
      const inner = section[1].trim();
      const label = section[2].trim();

      if (inner === '특이사항' || inner === '주의사항' || inner === '안내') {
        mode = 'notices';
        currentDay = null;
        continue;
      }

      const date = parseDate(inner, fallbackYear);
      if (!date) {
        warnings.push(`${i + 1}번째 줄: 날짜를 알아보지 못해 건너뛰었습니다 — "${line}"`);
        // 날짜를 못 읽은 구역의 일정이 앞 날짜에 섞이면 더 위험합니다.
        mode = 'head';
        currentDay = null;
        continue;
      }

      currentDay = { date, label: label || date, items: [] };
      days.push(currentDay);
      mode = 'day';
      continue;
    }

    if (mode === 'notices') {
      notices.push(line.replace(/^[-·•*]\s*/, ''));
      continue;
    }

    if (mode === 'day' && currentDay) {
      const item = parseItemLine(line);
      if (item) currentDay.items.push(item);
      else warnings.push(`${i + 1}번째 줄: 내용이 비어 건너뛰었습니다 — "${line}"`);
      continue;
    }

    // ── 머리말:  제목: / 기간: / 연락처:
    const kv = line.match(/^([^:：]{1,10})\s*[:：]\s*(.*)$/);
    if (kv) {
      const key = kv[1].trim();
      const value = kv[2].trim();

      if (key === '제목' || key === '여행' || key === '상품') {
        title = value;
        continue;
      }
      if (key === '기간' || key === '일정') {
        period = value;
        const y = value.match(/(\d{4})/);
        // 이후 [8/1] 같은 짧은 날짜의 연도를 여기서 가져옵니다.
        if (y) fallbackYear = Number(y[1]);
        continue;
      }
      if (key === '연락처' || key === '가이드') {
        const [label, phone] = value.split('|').map((s) => s.trim());
        if (label) contacts.push({ label, phone: phone || undefined });
        continue;
      }
    }

    warnings.push(`${i + 1}번째 줄: 알 수 없는 형식이라 건너뛰었습니다 — "${line}"`);
  }

  if (days.length === 0 && notices.length === 0) {
    return {
      itinerary: null,
      warnings,
      error: '읽을 수 있는 일정이 하나도 없습니다. 양식을 다시 확인해 주세요.',
    };
  }

  // 날짜 순으로 세웁니다. 하루 안의 항목은 적은 순서를 그대로 둡니다 —
  // 시간이 없는 항목(자유시간 등)의 위치가 곧 가이드의 의도이기 때문입니다.
  days.sort((a, b) => a.date.localeCompare(b.date));

  return {
    itinerary: {
      title: title || '여행 일정',
      period,
      contacts,
      notices,
      days,
      savedAt: new Date().toISOString(),
      source,
    },
    warnings,
  };
}

/* ------------------------------------------------------------------ */
/* 저장 (localStorage)                                                 */
/* ------------------------------------------------------------------ */

export function loadItinerary(): Itinerary | null {
  try {
    const raw = localStorage.getItem(ITINERARY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.days)) return null;
    return parsed as Itinerary;
  } catch {
    return null;
  }
}

export function saveItinerary(itinerary: Itinerary): void {
  try {
    localStorage.setItem(ITINERARY_STORAGE_KEY, JSON.stringify(itinerary));
  } catch (e) {
    console.warn('일정표 저장 실패:', e);
  }
}

export function clearItinerary(): void {
  try {
    localStorage.removeItem(ITINERARY_STORAGE_KEY);
  } catch (e) {
    console.warn('일정표 삭제 실패:', e);
  }
}

/* ------------------------------------------------------------------ */
/* "지금" 계산                                                          */
/* ------------------------------------------------------------------ */

/** 여행지 기준 오늘 날짜('YYYY-MM-DD')와 자정 기준 분 */
export function tripNow(now: Date = new Date()): { date: string; minutes: number } {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: TRIP_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(now);

    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
    const year = get('year');
    const month = get('month');
    const day = get('day');
    // hourCycle 에 따라 자정이 '24' 로 나오는 구현이 있습니다.
    const hour = Number(get('hour')) % 24;
    const minute = Number(get('minute'));

    if (year && month && day && !Number.isNaN(hour) && !Number.isNaN(minute)) {
      return { date: `${year}-${month}-${day}`, minutes: hour * 60 + minute };
    }
  } catch {
    // Intl 이 시간대를 모르는 환경 — 기기 시간으로 물러섭니다.
  }

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return { date: `${y}-${m}-${d}`, minutes: now.getHours() * 60 + now.getMinutes() };
}

/**
 * 오늘 남은 일정 중 가장 이른 것.
 * 시간이 적힌 확정 일정만 봅니다 — 옵션투어를 알리면 신청하지 않은 사람에게 오알림입니다.
 */
export function findNextItem(
  day: ItineraryDay | undefined,
  nowMinutes: number
): ItineraryItem | undefined {
  if (!day) return undefined;
  return day.items
    .filter(
      (it) => !it.optional && typeof it.minutes === 'number' && (it.minutes as number) >= nowMinutes
    )
    .sort((a, b) => (a.minutes as number) - (b.minutes as number))[0];
}

/**
 * 메모 안의 전화번호를 찾습니다 — 호텔·기사 번호는 현지에서 가장 자주 거는 번호인데
 * 지금은 그냥 글자라 누를 수가 없습니다.
 *
 * 국제표기(+63 …)와 한국식(010-…, 02-…)만 인정합니다. 헐겁게 잡으면
 * "2026-08-01" 이나 금액이 전화번호로 둔갑합니다.
 */
export const PHONE_PATTERN = /\+\d[\d\s-]{7,}\d|0\d{1,2}-\d{3,4}-\d{4}/g;

/** 전화번호를 기준으로 문자열을 조각냅니다. phone 이 있는 조각이 링크가 됩니다. */
export function splitPhones(text: string): Array<{ text: string; phone?: string }> {
  const out: Array<{ text: string; phone?: string }> = [];
  let last = 0;

  // 전역 정규식은 lastIndex 가 남으므로 매번 새로 만듭니다.
  const re = new RegExp(PHONE_PATTERN.source, 'g');
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[0], phone: m[0].replace(/[^\d+]/g, '') });
    last = m.index + m[0].length;
  }

  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/** "2시간 10분 뒤" 같은 문구 */
export function formatCountdown(fromMinutes: number, targetMinutes: number): string {
  const diff = targetMinutes - fromMinutes;
  if (diff <= 0) return '지금';
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m}분 뒤`;
  if (m === 0) return `${h}시간 뒤`;
  return `${h}시간 ${m}분 뒤`;
}

/** "8/1 (금)" — 칩에 쓰는 짧은 표기 */
export function shortDate(date: string): string {
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return date;
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][
    new Date(`${date}T00:00:00`).getDay()
  ];
  return `${Number(m[2])}/${Number(m[3])}${weekday ? ` (${weekday})` : ''}`;
}
