import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { xlsxToItineraryText, looksLikeXlsx } from './itineraryXlsx';
import { parseItinerary } from './itinerary';

const templateBytes = () =>
  new Uint8Array(fs.readFileSync(path.join(process.cwd(), 'public', 'itinerary-template.xlsx')));

describe('looksLikeXlsx', () => {
  it('ZIP 서명으로 알아본다 — 확장자는 믿지 않는다', () => {
    expect(looksLikeXlsx(templateBytes())).toBe(true);
  });

  it('텍스트 양식은 엑셀이 아니다', () => {
    expect(looksLikeXlsx(new TextEncoder().encode('#기조톡일정 v1\n제목: 테스트'))).toBe(false);
  });
});

describe('배포되는 엑셀 양식', () => {
  it('양식 텍스트로 바뀌고, 경고 없이 파싱된다', async () => {
    const text = await xlsxToItineraryText(templateBytes());
    const { itinerary, error, warnings } = parseItinerary(text);

    expect(error).toBeUndefined();
    expect(warnings).toEqual([]);
    expect(itinerary!.days).toHaveLength(5);
  });

  it('[안내] 시트의 제목·기간·연락처·특이사항을 옮긴다', async () => {
    const { itinerary } = parseItinerary(await xlsxToItineraryText(templateBytes()));

    expect(itinerary!.title).toBe('세부 4박5일 · 김기조님 외 3명');
    expect(itinerary!.period).toBe('2026-08-01 ~ 2026-08-05');
    expect(itinerary!.contacts).toEqual([
      { label: '현지가이드 홍길동', phone: '+63 917 123 4567' },
      { label: '한국 사무실', phone: '02-1234-5678' },
    ]);
    expect(itinerary!.notices).toHaveLength(3);
  });

  it('날짜·일차를 빈 칸에 물려준다 (엑셀에서는 그날 첫 줄에만 적습니다)', async () => {
    const { itinerary } = parseItinerary(await xlsxToItineraryText(templateBytes()));
    const day1 = itinerary!.days[0];

    expect(day1.date).toBe('2026-08-01');
    expect(day1.label).toBe('1일차 · 출국');
    // 날짜 칸이 비어 있던 줄들도 같은 날에 붙어야 합니다.
    expect(day1.items.length).toBeGreaterThan(1);
  });

  it('장소 칸이 전광판용 place 로 들어간다', async () => {
    const { itinerary } = parseItinerary(await xlsxToItineraryText(templateBytes()));
    const move = itinerary!.days[0].items.find((i) => i.title === '공항에서 호텔로');
    expect(move?.place).toBe('Bai Hotel Cebu, Mandaue City');
  });

  it('"(옵션)" 표기가 엑셀 경로에서도 살아남는다', async () => {
    const { itinerary } = parseItinerary(await xlsxToItineraryText(templateBytes()));
    const optional = itinerary!.days.flatMap((d) => d.items).filter((i) => i.optional);
    expect(optional).toHaveLength(1);
    expect(optional[0].title).toContain('오슬롭 고래상어');
  });

  it('메모의 전화번호가 살아 있다 (통화 링크가 걸려야 함)', async () => {
    const text = await xlsxToItineraryText(templateBytes());
    expect(text).toContain('+63 32 342 8888');
  });
});

/* ------------------------------------------------------------------ */
/* 손으로 만든 시트들 — 실제 가이드가 저지를 만한 상황                     */
/* ------------------------------------------------------------------ */

/** 테스트용 최소 xlsx 를 만듭니다 (무압축 ZIP — 리더가 method 0 도 읽는지 함께 검증). */
function makeXlsx(sheets: Array<{ name: string; rows: string[][] }>): Uint8Array {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const col = (i: number) => String.fromCharCode(65 + i);

  const files: Record<string, string> = {
    'xl/workbook.xml': `<workbook xmlns:r="http://x"><sheets>${sheets
      .map((s, i) => `<sheet name="${esc(s.name)}" r:id="rId${i + 1}"/>`)
      .join('')}</sheets></workbook>`,
    'xl/_rels/workbook.xml.rels': `<Relationships>${sheets
      .map((_, i) => `<Relationship Id="rId${i + 1}" Target="worksheets/sheet${i + 1}.xml"/>`)
      .join('')}</Relationships>`,
  };

  sheets.forEach((s, i) => {
    files[`xl/worksheets/sheet${i + 1}.xml`] =
      `<worksheet><sheetData>${s.rows
        .map(
          (cells, r) =>
            `<row r="${r + 1}">${cells
              .map((v, c) =>
                v
                  ? `<c r="${col(c)}${r + 1}" t="inlineStr"><is><t>${esc(v)}</t></is></c>`
                  : ''
              )
              .join('')}</row>`
        )
        .join('')}</sheetData></worksheet>`;
  });

  // 무압축(method 0) ZIP
  const enc = new TextEncoder();
  const locals: number[] = [];
  const centrals: number[] = [];
  let offset = 0;
  const push = (arr: number[], ...bytes: number[]) => arr.push(...bytes);
  const le16 = (n: number) => [n & 0xff, (n >> 8) & 0xff];
  const le32 = (n: number) => [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >>> 24) & 0xff];

  for (const [name, content] of Object.entries(files)) {
    const nameBytes = Array.from(enc.encode(name));
    const data = Array.from(enc.encode(content));
    push(locals, ...le32(0x04034b50), ...le16(20), ...le16(0x0800), ...le16(0));
    push(locals, ...le16(0), ...le16(0), ...le32(0), ...le32(data.length), ...le32(data.length));
    push(locals, ...le16(nameBytes.length), ...le16(0), ...nameBytes, ...data);

    push(centrals, ...le32(0x02014b50), ...le16(20), ...le16(20), ...le16(0x0800), ...le16(0));
    push(centrals, ...le16(0), ...le16(0), ...le32(0), ...le32(data.length), ...le32(data.length));
    push(centrals, ...le16(nameBytes.length), ...le16(0), ...le16(0), ...le16(0), ...le16(0));
    push(centrals, ...le32(0), ...le32(offset), ...nameBytes);

    offset += 30 + nameBytes.length + data.length;
  }

  const count = Object.keys(files).length;
  const eocd = [
    ...le32(0x06054b50), ...le16(0), ...le16(0), ...le16(count), ...le16(count),
    ...le32(centrals.length), ...le32(offset), ...le16(0),
  ];
  return new Uint8Array([...locals, ...centrals, ...eocd]);
}

describe('가이드가 저지를 만한 엑셀', () => {
  it('머리글 위에 제목 줄이나 빈 줄이 있어도 표를 찾아낸다', async () => {
    const bytes = makeXlsx([
      {
        name: '일정',
        rows: [
          ['2026년 세부 일정표'],
          [],
          ['날짜', '시간', '종류', '내용'],
          ['2026-08-01', '09:00', '이동', '공항으로'],
        ],
      },
    ]);
    const { itinerary } = parseItinerary(await xlsxToItineraryText(bytes));
    expect(itinerary!.days[0].items[0].title).toBe('공항으로');
  });

  it('머리글 표기가 달라도 알아본다 (일자/비고/분류)', async () => {
    const bytes = makeXlsx([
      {
        name: 'Sheet1',
        rows: [
          ['일자', '시간', '분류', '내용', '위치', '비고'],
          ['2026-08-01', '09:00', '이동', '공항으로', 'NAIA Terminal 1', '여권 지참'],
        ],
      },
    ]);
    const item = parseItinerary(await xlsxToItineraryText(bytes)).itinerary!.days[0].items[0];
    expect(item).toMatchObject({
      kind: '이동',
      title: '공항으로',
      place: 'NAIA Terminal 1',
      note: '여권 지참',
    });
  });

  it('엑셀이 날짜·시간을 숫자로 바꿔둬도 되돌린다', async () => {
    // 46235 = 2026-08-01, 0.3125 = 07:30
    const bytes = makeXlsx([
      { name: '일정', rows: [['날짜', '시간', '내용'], ['46235', '0.3125', '집합']] },
    ]);
    const day = parseItinerary(await xlsxToItineraryText(bytes)).itinerary!.days[0];
    expect(day.date).toBe('2026-08-01');
    expect(day.items[0].time).toBe('07:30');
  });

  it('칸 안에 | 나 @ 가 들어가도 줄이 어긋나지 않는다', async () => {
    const bytes = makeXlsx([
      {
        name: '일정',
        rows: [
          ['날짜', '시간', '내용', '메모'],
          ['2026-08-01', '09:00', 'A|B 식당 @2층', '가격 | 1인 500페소'],
        ],
      },
    ]);
    const item = parseItinerary(await xlsxToItineraryText(bytes)).itinerary!.days[0].items[0];
    expect(item.title).toBe('A B 식당 2층');
    expect(item.note).toBe('가격 1인 500페소');
  });

  it('"내용" 칸이 없으면 무엇이 잘못됐는지 알려준다', async () => {
    const bytes = makeXlsx([{ name: '일정', rows: [['가', '나'], ['1', '2']] }]);
    await expect(xlsxToItineraryText(bytes)).rejects.toThrow('내용');
  });

  it('엑셀이 아닌 파일은 거부한다', async () => {
    await expect(xlsxToItineraryText(new TextEncoder().encode('그냥 글자'))).rejects.toThrow();
  });
});
