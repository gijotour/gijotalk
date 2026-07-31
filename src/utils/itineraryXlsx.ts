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

import { Grid, gridsToItineraryText } from './itineraryGrid';
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

  const scheduleGrid = await gridOf(scheduleIdx);
  const infoGrid = infoIdx >= 0 && infoIdx !== scheduleIdx ? await gridOf(infoIdx) : undefined;

  return gridsToItineraryText(scheduleGrid, infoGrid);
}
