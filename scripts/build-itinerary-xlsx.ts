/**
 * 배포용 엑셀 양식(public/itinerary-template.xlsx) 을 만듭니다.
 *
 *   npm run xlsx
 *
 * .xlsx 는 XML 몇 개가 든 ZIP 일 뿐이라 라이브러리 없이 직접 씁니다. 런타임
 * 번들에는 아무것도 더하지 않고, 이 스크립트는 빌드할 때만 돕니다.
 *
 * 값은 전부 inlineStr(글자)로 넣습니다. 날짜·시간을 엑셀 일련번호로 넣으면
 * 보기에는 같아도 파일이 무거워지고, 리더 쪽 변환에 의존하게 됩니다.
 * 가이드가 셀을 고쳐 진짜 날짜 서식으로 바꿔도 리더가 숫자를 알아보므로
 * 양쪽 다 동작합니다.
 */

import { deflateRawSync } from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public', 'itinerary-template.xlsx');

/* ------------------------------------------------------------------ */
/* 시트 내용                                                           */
/* ------------------------------------------------------------------ */

const INFO_ROWS: string[][] = [
  ['항목', '내용', '(추가)'],
  ['제목', '세부 4박5일 · 김기조님 외 3명'],
  ['기간', '2026-08-01 ~ 2026-08-05'],
  ['연락처', '현지가이드 홍길동', '+63 917 123 4567'],
  ['연락처', '한국 사무실', '02-1234-5678'],
  ['특이사항', '여권 유효기간이 6개월 이상 남아야 입국됩니다'],
  ['특이사항', '8월은 우기라 우비를 챙기세요'],
  ['특이사항', '호핑투어 날은 수영복을 미리 입고 나오세요'],
];

const SCHEDULE_ROWS: string[][] = [
  ['날짜', '일차', '시간', '종류', '내용', '장소', '메모'],
  ['2026-08-01', '1일차 · 출국', '06:30', '집합', '인천공항 3층 M카운터', '', '여권 지참'],
  ['', '', '09:20', '항공', 'PR469 인천 → 세부', '', ''],
  ['', '', '13:40', '이동', '공항에서 호텔로', 'Bai Hotel Cebu, Mandaue City', ''],
  ['', '', '15:00', '숙소', '체크인', '', '보증금 현금 2000페소, 프런트 +63 32 342 8888'],
  ['', '', '18:30', '식사', '현지식 저녁', 'Lantaw Native Restaurant, Cordova', ''],

  ['2026-08-02', '2일차 · 호핑투어', '06:00', '식사', '호텔 조식', '', ''],
  ['', '', '07:00', '집합', '로비 집합', '', '수영복 착용, 선크림 필수'],
  ['', '', '08:00', '투어', '힐루뚱안 섬 호핑', 'Hilutungan Island', ''],
  ['', '', '17:00', '자유', '자유시간', '', ''],
  ['', '', '', '기타', '저녁은 각자 해결', '', ''],

  ['2026-08-03', '3일차 · 시내투어', '07:00', '식사', '호텔 조식', '', ''],
  ['', '', '09:00', '투어', '마젤란 십자가 · 산토니뇨 성당', "Magellan's Cross, Cebu City", ''],
  ['', '', '12:30', '식사', '점심 (현지식)', '', ''],
  ['', '', '14:00', '쇼핑', '아얄라몰 자유쇼핑', 'Ayala Center Cebu', '집합 17:00 정문'],
  ['', '', '19:00', '이동', '호텔 복귀', '', ''],

  ['2026-08-04', '4일차 · 자유일정', '07:00', '식사', '호텔 조식', '', ''],
  ['', '', '', '자유', '종일 자유시간', '', '외출 시 가이드에게 알려주세요'],
  [
    '',
    '',
    '10:00',
    '투어',
    '(옵션) 오슬롭 고래상어 - 1인 3500페소',
    '',
    '신청자만, 전날 21시까지',
  ],
  ['', '', '18:00', '식사', '단체 회식', 'Sutukil Seafood, Lapu-Lapu', ''],

  ['2026-08-05', '5일차 · 귀국', '08:00', '식사', '호텔 조식', '', ''],
  ['', '', '10:00', '숙소', '체크아웃', '', '방 안 물건 다시 확인'],
  [
    '',
    '',
    '11:00',
    '이동',
    '호텔에서 공항으로',
    'Mactan-Cebu International Airport',
    '',
  ],
  ['', '', '14:15', '항공', 'PR468 세부 → 인천', '', ''],
  ['', '', '19:40', '기타', '인천 도착 · 해산', '', ''],
];

/* ------------------------------------------------------------------ */
/* XML 만들기                                                          */
/* ------------------------------------------------------------------ */

const NS_REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const NS_PKG_REL = 'http://schemas.openxmlformats.org/package/2006/relationships';
const NS_MAIN = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const colName = (i: number): string => {
  let n = i + 1;
  let out = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    out = String.fromCharCode(65 + r) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
};

/**
 * 시트 XML.
 *
 * 요소 순서(dimension → sheetViews → sheetFormatPr → cols → sheetData)는 OOXML
 * 스키마가 정한 것입니다. 어긋나면 엑셀이 "복구가 필요합니다" 를 띄웁니다.
 * SheetJS 같은 관대한 파서는 그냥 읽어버려서 눈치채기 어렵습니다.
 */
function sheetXml(rows: string[][], widths: number[]): string {
  const body = rows
    .map((cells, r) => {
      const cs = cells
        .map((value, c) =>
          value
            ? `<c r="${colName(c)}${r + 1}"${r === 0 ? ' s="1"' : ''} t="inlineStr"><is><t xml:space="preserve">${esc(
                value
              )}</t></is></c>`
            : ''
        )
        .join('');
      return `<row r="${r + 1}"${r === 0 ? ' ht="20" customHeight="1"' : ''}>${cs}</row>`;
    })
    .join('');

  const cols = widths
    .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="${NS_MAIN}"><dimension ref="A1:${colName(
    Math.max(1, widths.length) - 1
  )}${rows.length}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="16"/><cols>${cols}</cols><sheetData>${body}</sheetData></worksheet>`;
}

/** 설명 시트 — 사용법이 파일 안에 같이 다녀야 가이드가 따로 찾지 않습니다. */
const HELP_ROWS: string[][] = [
  ['기조톡 일정표 양식 — 사용법'],
  [''],
  ['1', '[일정] 시트의 칸만 채우고 저장한 뒤, 카톡·텔레그램으로 보내면 됩니다.'],
  ['2', '날짜와 일차는 그날 첫 줄에만 적으세요. 아래 줄은 비워두면 이어집니다.'],
  ['3', '종류에 쓸 수 있는 말: 집합 항공 이동 식사 투어 숙소 쇼핑 자유 기타'],
  ['', '(여기 없는 말을 쓰면 "기타" 로 들어갑니다)'],
  ['4', '장소 칸을 채우면 그 일정에 [기사에게 보여주기] 버튼이 생깁니다.'],
  ['', '기사에게 폰을 그대로 보여주는 화면입니다. 현지 표기(영문)로 적어주세요.'],
  ['5', '신청자만 가는 옵션투어는 내용 앞에 "(옵션)" 을 붙여주세요.'],
  ['', '안 붙이면 신청하지 않은 분에게도 곧 출발한다고 알림이 갑니다.'],
  ['6', '메모에 적은 전화번호(+63 32 342 8888)는 앱에서 눌러 바로 걸립니다.'],
  ['7', '[안내] 시트에는 제목·기간·연락처·특이사항을 적습니다.'],
  ['', '연락처와 특이사항은 줄을 늘려 여러 개 적을 수 있습니다.'],
  [''],
  ['※', '시트 이름(일정·안내)은 바꾸지 마세요.'],
];

const CT_SHEET = 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml';

const FILES: Record<string, string> = {
  // [Content_Types].xml 은 ZIP 의 첫 항목이어야 합니다. 엑셀이 여기부터 읽습니다.
  '[Content_Types].xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="${CT_SHEET}"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="${CT_SHEET}"/><Override PartName="/xl/worksheets/sheet3.xml" ContentType="${CT_SHEET}"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`,

  '_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="${NS_PKG_REL}"><Relationship Id="rId1" Type="${NS_REL}/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="${NS_REL}/extended-properties" Target="docProps/app.xml"/></Relationships>`,

  'docProps/core.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>기조톡 일정표 양식</dc:title><dc:creator>GIJO LABS</dc:creator><cp:lastModifiedBy>GIJO LABS</cp:lastModifiedBy></cp:coreProperties>`,

  'docProps/app.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>GIJO Tour</Application></Properties>`,

  'xl/workbook.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="${NS_MAIN}" xmlns:r="${NS_REL}"><bookViews><workbookView/></bookViews><sheets><sheet name="일정" sheetId="1" r:id="rId1"/><sheet name="안내" sheetId="2" r:id="rId2"/><sheet name="설명" sheetId="3" r:id="rId3"/></sheets></workbook>`,

  'xl/_rels/workbook.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="${NS_PKG_REL}"><Relationship Id="rId1" Type="${NS_REL}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${NS_REL}/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="${NS_REL}/worksheet" Target="worksheets/sheet3.xml"/><Relationship Id="rId4" Type="${NS_REL}/styles" Target="styles.xml"/></Relationships>`,

  // fills 0·1 은 반드시 none·gray125 여야 합니다. 엑셀이 요구하는 고정 규칙입니다.
  'xl/styles.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="${NS_MAIN}"><fonts count="2"><font><sz val="11"/><name val="맑은 고딕"/></font><font><b/><sz val="11"/><name val="맑은 고딕"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFE9D6"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,

  'xl/worksheets/sheet1.xml': sheetXml(SCHEDULE_ROWS, [13, 18, 8, 8, 34, 34, 34]),
  'xl/worksheets/sheet2.xml': sheetXml(INFO_ROWS, [12, 44, 24]),
  'xl/worksheets/sheet3.xml': sheetXml(HELP_ROWS, [5, 78]),
};

/* ------------------------------------------------------------------ */
/* ZIP 쓰기                                                            */
/* ------------------------------------------------------------------ */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function buildZip(files: Record<string, string>): Buffer {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;

  for (const [name, content] of Object.entries(files)) {
    const nameBuf = Buffer.from(name, 'utf8');
    const raw = Buffer.from(content, 'utf8');
    const deflated = deflateRawSync(raw);
    const crc = crc32(raw);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version
    local.writeUInt16LE(0x0800, 6); // UTF-8 이름 플래그
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(deflated.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    locals.push(local, nameBuf, deflated);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(deflated.length, 20);
    central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuf);

    offset += 30 + nameBuf.length + deflated.length;
  }

  const centralBuf = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(Object.keys(files).length, 8);
  eocd.writeUInt16LE(Object.keys(files).length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);

  return Buffer.concat([Buffer.concat(locals), centralBuf, eocd]);
}

fs.writeFileSync(OUT, buildZip(FILES));
console.log(`엑셀 양식 생성: ${OUT} (${fs.statSync(OUT).size} bytes)`);
console.log(`  [일정] 시트 ${SCHEDULE_ROWS.length - 1}행 · [안내] 시트 ${INFO_ROWS.length - 1}행`);
