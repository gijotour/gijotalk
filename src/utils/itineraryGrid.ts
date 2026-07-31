// 표(엑셀 시트 · 구글시트) → 일정표 양식 텍스트.
//
// 엑셀(.xlsx)과 구글시트는 가져오는 방법만 다를 뿐 도착점은 같은 2차원 표입니다.
// 그 표를 읽는 규칙은 여기 한 곳에만 둡니다 — 열 이름 별칭, 날짜 물려받기,
// 구분자 충돌 정리 같은 것들이 두 벌로 갈라지면 반드시 어긋납니다.
//
// 결과는 양식 텍스트라 그대로 parseItinerary 에 넘깁니다. 표 경로가 두 번째
// 파서가 되지 않게 하려는 것입니다.

import { ITINERARY_MAGIC } from './itinerary';

/** 시트 한 장을 글자 2차원 배열로 본 것 */
export type Grid = string[][];

/**
 * 엑셀 날짜 일련번호 → 'YYYY-MM-DD'.
 * 기준은 1899-12-30 입니다 (엑셀이 1900년을 윤년으로 잘못 아는 관행을 그대로 흡수).
 */
function serialToDate(serial: number): string {
  const ms = Math.floor(serial) * 86400000 + Date.UTC(1899, 11, 30);
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
}

/** 엑셀 시각(하루의 소수 비율) → 'HH:MM'. 0.3125 → 07:30 */
function serialToTime(serial: number): string {
  const minutes = Math.round((serial % 1) * 24 * 60);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(Math.floor(minutes / 60) % 24)}:${p(minutes % 60)}`;
}


/** 머리글 이름 → 우리가 쓰는 열 이름. 표기 흔들림을 흡수합니다. */
const HEADER_ALIASES: Record<string, string> = {
  날짜: '날짜',
  일자: '날짜',
  date: '날짜',
  일차: '일차',
  구분: '일차',
  일차제목: '일차',
  시간: '시간',
  time: '시간',
  종류: '종류',
  분류: '종류',
  유형: '종류',
  내용: '내용',
  일정: '내용',
  항목: '내용',
  장소: '장소',
  위치: '장소',
  place: '장소',
  메모: '메모',
  비고: '메모',
  note: '메모',
};

const normalizeHeader = (s: string) =>
  HEADER_ALIASES[s.trim().toLowerCase().replace(/\s+/g, '')] ?? '';

const isBlankRow = (row: string[]) => row.every((c) => !c || !c.trim());

/** 숫자로만 이루어진 칸인지 (엑셀이 날짜·시간을 숫자로 바꿔둔 경우) */
const isNumeric = (s: string) => s !== '' && !Number.isNaN(Number(s));

export function scheduleToLines(grid: Grid): string[] {
  // 머리글 줄 찾기 — 위쪽에 제목이나 빈 줄이 있어도 되게 합니다.
  let headerRow = -1;
  let columns: string[] = [];
  for (let i = 0; i < grid.length; i++) {
    const mapped = grid[i].map(normalizeHeader);
    if (mapped.includes('내용')) {
      headerRow = i;
      columns = mapped;
      break;
    }
  }
  if (headerRow < 0) {
    throw new Error(
      '일정 표를 찾지 못했습니다. 머리글에 "내용" 칸이 있는지 확인해 주세요.'
    );
  }

  const at = (row: string[], key: string): string => {
    const i = columns.indexOf(key);
    return i < 0 ? '' : (row[i] ?? '').trim();
  };

  const lines: string[] = [];
  // 날짜와 일차는 그날 첫 줄에만 적는 게 자연스럽습니다. 빈 칸은 위에서 물려받습니다.
  let currentDate = '';
  let currentLabel = '';
  let openDate = '';

  for (const row of grid.slice(headerRow + 1)) {
    if (isBlankRow(row)) continue;

    const rawDate = at(row, '날짜');
    if (rawDate) currentDate = isNumeric(rawDate) ? serialToDate(Number(rawDate)) : rawDate;

    const rawLabel = at(row, '일차');
    if (rawLabel) currentLabel = rawLabel;

    const content = at(row, '내용');
    if (!content) continue; // 내용 없는 줄은 일정이 아닙니다
    if (!currentDate) continue; // 날짜 없이 시작한 줄은 어디에 붙일지 알 수 없습니다

    if (currentDate !== openDate) {
      if (lines.length) lines.push('');
      lines.push(`[${currentDate}]${currentLabel ? ` ${currentLabel}` : ''}`);
      openDate = currentDate;
    }

    const rawTime = at(row, '시간');
    const time = isNumeric(rawTime) ? serialToTime(Number(rawTime)) : rawTime;

    const place = at(row, '장소');
    const note = at(row, '메모');
    const kind = at(row, '종류');

    // 파이프와 @ 는 양식의 구분자입니다. 칸 안에 들어 있으면 줄이 어긋나므로 지웁니다.
    const clean = (s: string) => s.replace(/[|@]/g, ' ').replace(/\s+/g, ' ').trim();

    let line = `${time || '-'} | ${clean(kind) || '기타'} | ${clean(content)}`;
    if (place) line += ` @${clean(place)}`;
    if (note) line += ` | ${clean(note)}`;
    lines.push(line);
  }

  if (!lines.length) throw new Error('읽을 수 있는 일정이 없습니다.');
  return lines;
}

export function infoToLines(grid: Grid): string[] {
  const head: string[] = [];
  const notices: string[] = [];

  for (const row of grid) {
    if (isBlankRow(row)) continue;
    const key = (row[0] ?? '').trim().replace(/\s+/g, '');
    const rest = row.slice(1).map((c) => (c ?? '').trim());
    const value = rest.filter(Boolean).join(' | ');
    if (!key || !value) continue;

    if (key === '제목' || key === '여행' || key === '상품') head.push(`제목: ${value}`);
    else if (key === '기간' || key === '일정') head.push(`기간: ${value}`);
    else if (key === '연락처' || key === '가이드') head.push(`연락처: ${value}`);
    else if (key === '특이사항' || key === '주의사항' || key === '안내')
      notices.push(rest.filter(Boolean).join(' '));
  }

  if (!notices.length) return head;
  return [...head, '', '[특이사항]', ...notices];
}


/**
 * [일정] 표와 [안내] 표를 합쳐 양식 텍스트를 만듭니다.
 * 안내 표는 없어도 됩니다 — 제목·연락처 없이 일정만 있는 시트도 흔합니다.
 */
export function gridsToItineraryText(schedule: Grid, info?: Grid): string {
  const scheduleLines = scheduleToLines(schedule);
  const infoLines = info ? infoToLines(info) : [];

  return [ITINERARY_MAGIC + ' v1', '', ...infoLines, ...(infoLines.length ? [''] : []), ...scheduleLines]
    .join('\n');
}
