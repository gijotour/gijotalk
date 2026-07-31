// 엑셀(.xlsx) 일정표 읽기.
//
// ── 왜 엑셀을 받는가
//   여행사 일정표는 원래 엑셀로 만듭니다. 가이드에게 새 문법을 가르치는 대신
//   쓰던 도구를 그대로 쓰게 하는 편이 훨씬 빠릅니다. 덤으로 .xlsx 내부는 항상
//   UTF-8 XML 이라 한글 인코딩 문제가 원천적으로 없습니다 — 메모장이 CP949 로
//   열어 한글이 깨지던 종류의 사고가 아예 발생하지 않습니다.
//
// ── 왜 텍스트로 바꿔서 넘기는가
//   여기서 Itinerary 를 직접 만들지 않고 "양식 텍스트" 를 만들어 기존 파서에
//   넘깁니다. 그래야
//     · 파싱 규칙(옵션·@장소·시간 해석)이 한 곳에만 있고
//     · 엑셀로 올린 일정표도 링크 공유와 가이드 편집이 그대로 동작합니다.
//   엑셀 리더는 "입구" 하나를 더 여는 것일 뿐, 두 번째 파서가 아닙니다.
//
// ── 왜 라이브러리를 안 쓰는가
//   .xlsx 는 사실상 XML 이 든 ZIP 이고, 브라우저에 ZIP 압축 해제(deflate-raw)와
//   XML 파서가 이미 들어 있습니다. 오프라인 우선 앱에 수백 KB 짜리 의존성을
//   더하지 않으려고 필요한 만큼만 직접 읽습니다.

import { ITINERARY_MAGIC } from './itinerary';
import { transformBytes } from './bytes';

/** 엑셀 파일인지 — ZIP 서명(PK\x03\x04) 으로 봅니다. 확장자는 못 믿습니다. */
export function looksLikeXlsx(bytes: Uint8Array): boolean {
  return bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;
}

/* ------------------------------------------------------------------ */
/* ZIP 읽기                                                            */
/* ------------------------------------------------------------------ */

interface ZipEntry {
  offset: number; // 로컬 헤더 위치
  method: number; // 0 = 무압축, 8 = deflate
  size: number; // 압축된 크기
}

const SIG_EOCD = 0x06054b50;
const SIG_CENTRAL = 0x02014b50;

function u16(v: DataView, at: number) {
  return v.getUint16(at, true);
}
function u32(v: DataView, at: number) {
  return v.getUint32(at, true);
}

/** 중앙 디렉터리를 훑어 파일 이름 → 위치 표를 만듭니다. */
function readZipIndex(bytes: Uint8Array): Map<string, ZipEntry> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  // EOCD 는 파일 끝에 있고 주석이 붙을 수 있어 뒤에서부터 찾습니다.
  let eocd = -1;
  for (let i = bytes.length - 22; i >= 0 && i >= bytes.length - 22 - 0xffff; i--) {
    if (u32(view, i) === SIG_EOCD) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error('엑셀 파일 구조를 읽지 못했습니다.');

  const count = u16(view, eocd + 10);
  let at = u32(view, eocd + 16);
  const decoder = new TextDecoder();
  const index = new Map<string, ZipEntry>();

  for (let i = 0; i < count; i++) {
    if (u32(view, at) !== SIG_CENTRAL) break;
    const method = u16(view, at + 10);
    const size = u32(view, at + 20);
    const nameLen = u16(view, at + 28);
    const extraLen = u16(view, at + 30);
    const commentLen = u16(view, at + 32);
    const offset = u32(view, at + 42);
    const name = decoder.decode(bytes.subarray(at + 46, at + 46 + nameLen));
    index.set(name, { offset, method, size });
    at += 46 + nameLen + extraLen + commentLen;
  }
  return index;
}

function inflate(data: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('이 브라우저에서는 엑셀 파일을 열 수 없습니다. 텍스트(.txt) 양식을 써주세요.');
  }
  return transformBytes(data, new DecompressionStream('deflate-raw'));
}

/** ZIP 안의 파일 하나를 글자로 꺼냅니다. 없으면 null. */
async function readZipText(
  bytes: Uint8Array,
  index: Map<string, ZipEntry>,
  name: string
): Promise<string | null> {
  const entry = index.get(name);
  if (!entry) return null;

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  // 로컬 헤더의 이름·추가필드 길이는 중앙 디렉터리와 다를 수 있으므로 여기서 다시 읽습니다.
  const nameLen = u16(view, entry.offset + 26);
  const extraLen = u16(view, entry.offset + 28);
  const start = entry.offset + 30 + nameLen + extraLen;
  const raw = bytes.subarray(start, start + entry.size);

  const out = entry.method === 0 ? raw : await inflate(raw);
  return new TextDecoder().decode(out);
}

/* ------------------------------------------------------------------ */
/* 시트 읽기                                                           */
/* ------------------------------------------------------------------ */

function parseXml(text: string): Document {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('엑셀 파일을 읽지 못했습니다.');
  }
  return doc;
}

/** "B7" → 열 번호 1 (0부터) */
function columnOf(ref: string): number {
  let n = 0;
  for (const ch of ref) {
    const code = ch.charCodeAt(0);
    if (code < 65 || code > 90) break;
    n = n * 26 + (code - 64);
  }
  return n - 1;
}

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

type Grid = string[][];

/** 시트 XML → 2차원 글자 배열. 숫자 칸은 숫자 그대로 문자열로 둡니다. */
function readGrid(sheetXml: string, sharedStrings: string[]): Grid {
  const doc = parseXml(sheetXml);
  const grid: Grid = [];

  for (const row of Array.from(doc.getElementsByTagName('row'))) {
    const cells: string[] = [];
    for (const c of Array.from(row.getElementsByTagName('c'))) {
      const col = columnOf(c.getAttribute('r') ?? '');
      const type = c.getAttribute('t');

      let value = '';
      if (type === 'inlineStr') {
        value = Array.from(c.getElementsByTagName('t'))
          .map((t) => t.textContent ?? '')
          .join('');
      } else {
        const v = c.getElementsByTagName('v')[0]?.textContent ?? '';
        if (type === 's') value = sharedStrings[Number(v)] ?? '';
        else value = v;
      }

      if (col >= 0) cells[col] = (value ?? '').trim();
    }
    // 빈 칸이 sparse 하게 비어 있을 수 있으므로 구멍을 메웁니다.
    for (let i = 0; i < cells.length; i++) if (cells[i] === undefined) cells[i] = '';
    grid.push(cells);
  }
  return grid;
}

function readSharedStrings(xml: string | null): string[] {
  if (!xml) return [];
  const doc = parseXml(xml);
  return Array.from(doc.getElementsByTagName('si')).map((si) =>
    Array.from(si.getElementsByTagName('t'))
      .map((t) => t.textContent ?? '')
      .join('')
  );
}

/* ------------------------------------------------------------------ */
/* 시트 → 양식 텍스트                                                   */
/* ------------------------------------------------------------------ */

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

function scheduleToLines(grid: Grid): string[] {
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
      '엑셀에서 일정 표를 찾지 못했습니다. 머리글에 "내용" 칸이 있는지 확인해 주세요.'
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

  if (!lines.length) throw new Error('엑셀에 읽을 수 있는 일정이 없습니다.');
  return lines;
}

function infoToLines(grid: Grid): string[] {
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

/* ------------------------------------------------------------------ */
/* 본체                                                                */
/* ------------------------------------------------------------------ */

const pickSheet = (names: string[], want: string[]): number => {
  for (const w of want) {
    const i = names.findIndex((n) => n.includes(w));
    if (i >= 0) return i;
  }
  return -1;
};

/**
 * 엑셀 일정표 → 양식 텍스트.
 * 결과는 그대로 parseItinerary 에 넘길 수 있습니다.
 */
export async function xlsxToItineraryText(bytes: Uint8Array): Promise<string> {
  const index = readZipIndex(bytes);

  const workbookXml = await readZipText(bytes, index, 'xl/workbook.xml');
  if (!workbookXml) throw new Error('엑셀 파일이 아닙니다.');

  const relsXml = await readZipText(bytes, index, 'xl/_rels/workbook.xml.rels');
  const relTarget = new Map<string, string>();
  if (relsXml) {
    for (const rel of Array.from(parseXml(relsXml).getElementsByTagName('Relationship'))) {
      relTarget.set(rel.getAttribute('Id') ?? '', rel.getAttribute('Target') ?? '');
    }
  }

  const sheetNodes = Array.from(parseXml(workbookXml).getElementsByTagName('sheet'));
  const names = sheetNodes.map((s) => s.getAttribute('name') ?? '');
  const paths = sheetNodes.map((s, i) => {
    const rid = s.getAttribute('r:id') ?? s.getAttributeNS?.('*', 'id') ?? '';
    const target = relTarget.get(rid) ?? `worksheets/sheet${i + 1}.xml`;
    return target.startsWith('/') ? target.slice(1) : `xl/${target.replace(/^\.\//, '')}`;
  });

  const shared = readSharedStrings(await readZipText(bytes, index, 'xl/sharedStrings.xml'));

  const gridOf = async (i: number): Promise<Grid> => {
    const xml = await readZipText(bytes, index, paths[i]);
    return xml ? readGrid(xml, shared) : [];
  };

  // 시트 이름은 가이드가 바꿀 수 있으므로 이름을 못 찾으면 순서로 물러섭니다.
  let scheduleIdx = pickSheet(names, ['일정', '스케줄']);
  let infoIdx = pickSheet(names, ['안내', '정보', '기본']);
  if (scheduleIdx < 0) scheduleIdx = infoIdx === 0 ? 1 : 0;
  if (scheduleIdx >= names.length) scheduleIdx = 0;

  const scheduleLines = scheduleToLines(await gridOf(scheduleIdx));
  const infoLines = infoIdx >= 0 && infoIdx !== scheduleIdx ? infoToLines(await gridOf(infoIdx)) : [];

  return [ITINERARY_MAGIC + ' v1', '', ...infoLines, infoLines.length ? '' : null, ...scheduleLines]
    .filter((l): l is string => l !== null)
    .join('\n');
}
