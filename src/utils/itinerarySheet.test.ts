import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseSheetUrl, sheetHomeUrl, csvUrl, parseCsv, sheetToItineraryText } from './itinerarySheet';
import { parseItinerary } from './itinerary';
import { buildSheetLink } from './itineraryLink';

describe('구글시트 주소 해석', () => {
  it('가이드가 주소창에서 복사해 오는 여러 모양을 다 받는다', () => {
    const forms = [
      'https://docs.google.com/spreadsheets/d/1AbC-dEf_123/edit#gid=0',
      'https://docs.google.com/spreadsheets/d/1AbC-dEf_123/edit?usp=sharing',
      'https://docs.google.com/spreadsheets/d/1AbC-dEf_123/',
      '  https://docs.google.com/spreadsheets/d/1AbC-dEf_123/edit  ',
    ];
    for (const url of forms) {
      expect(parseSheetUrl(url)).toEqual({ id: '1AbC-dEf_123', kind: 'doc' });
    }
  });

  it('웹에 게시(/d/e/) 주소를 doc 으로 잘못 읽지 않는다', () => {
    // /d/ 규칙이 먼저 걸리면 ID 가 "e" 가 되어 조용히 엉뚱한 문서를 가리킵니다.
    expect(parseSheetUrl('https://docs.google.com/spreadsheets/d/e/2PACX-1vABC/pubhtml')).toEqual({
      id: '2PACX-1vABC',
      kind: 'pub',
    });
  });

  it('구글시트가 아닌 주소는 거부한다', () => {
    for (const url of [
      '',
      '내일 10시 집합',
      'https://example.com/spreadsheets/d/123',
      'https://docs.google.com/document/d/123/edit',
      '#기조톡일정 v1',
    ]) {
      expect(parseSheetUrl(url)).toBeNull();
    }
  });

  it('연결 방식에 맞는 CSV 주소를 만든다', () => {
    const doc = parseSheetUrl('https://docs.google.com/spreadsheets/d/ID1/edit')!;
    expect(csvUrl(doc, '일정')).toBe(
      'https://docs.google.com/spreadsheets/d/ID1/gviz/tq?tqx=out:csv&sheet=%EC%9D%BC%EC%A0%95'
    );

    const pub = parseSheetUrl('https://docs.google.com/spreadsheets/d/e/PUB1/pubhtml')!;
    expect(csvUrl(pub, '안내')).toContain('/d/e/PUB1/pub?output=csv&sheet=');
  });

  it('사람이 보는 주소로 되돌린다', () => {
    expect(sheetHomeUrl({ id: 'ID1', kind: 'doc' })).toBe(
      'https://docs.google.com/spreadsheets/d/ID1/edit'
    );
  });
});

describe('CSV 해석', () => {
  it('따옴표 안의 쉼표를 칸 구분으로 착각하지 않는다', () => {
    // 메모에 쉼표를 쓰는 건 아주 흔합니다. 잘못 자르면 그 줄부터 통째로 어긋납니다.
    const grid = parseCsv('시간,내용,메모\n09:00,체크인,"보증금 2000페소, 프런트 문의"');
    expect(grid[1]).toEqual(['09:00', '체크인', '보증금 2000페소, 프런트 문의']);
  });

  it('따옴표 안의 줄바꿈을 새 줄로 착각하지 않는다', () => {
    const grid = parseCsv('내용,메모\n집합,"첫째 줄\n둘째 줄"');
    expect(grid).toHaveLength(2);
    expect(grid[1][1]).toBe('첫째 줄\n둘째 줄');
  });

  it('이중 따옴표를 한 개로 되돌린다', () => {
    expect(parseCsv('내용\n"그가 ""안녕"" 이라 했다"')[1][0]).toBe('그가 "안녕" 이라 했다');
  });

  it('윈도우 줄바꿈과 BOM 을 흡수한다', () => {
    expect(parseCsv('﻿가,나\r\n1,2')).toEqual([
      ['가', '나'],
      ['1', '2'],
    ]);
  });

  it('빈 칸을 유지한다 — 날짜 물려받기가 여기에 기댄다', () => {
    expect(parseCsv('날짜,시간,내용\n2026-08-01,09:00,집합\n,10:00,이동')[2]).toEqual([
      '',
      '10:00',
      '이동',
    ]);
  });
});

/* ------------------------------------------------------------------ */

const SCHEDULE_CSV = `날짜,일차,시간,종류,내용,장소,메모
2026-08-01,1일차 · 출국,06:30,집합,인천공항 3층 M카운터,,여권 지참
,,13:40,이동,공항에서 호텔로,"Bai Hotel Cebu, Mandaue City",
,,15:00,숙소,체크인,,"보증금 2000페소, 프런트 +63 32 342 8888"
2026-08-02,2일차 · 호핑,08:00,투어,(옵션) 힐루뚱안 섬,Hilutungan Island,1인 1500페소`;

const INFO_CSV = `항목,내용,(추가)
제목,세부 2박3일 · 김기조님
기간,2026-08-01 ~ 2026-08-02
연락처,현지가이드 제이,+63 917 555 0101
특이사항,여권 유효기간 6개월 이상
특이사항,우비를 챙기세요`;

describe('구글시트 → 일정표', () => {
  afterEach(() => vi.unstubAllGlobals());

  /** sheet= 파라미터를 보고 알맞은 CSV 를 돌려주는 가짜 구글 */
  const stubGoogle = (opts: { info?: string | null; html?: boolean } = {}) => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (opts.html) return new Response('<!doctype html><html>로그인</html>', { status: 200 });
        const isInfo = decodeURIComponent(url).includes('sheet=안내');
        if (isInfo) {
          if (opts.info === null) return new Response('', { status: 404 });
          return new Response(opts.info ?? INFO_CSV, { status: 200 });
        }
        return new Response(SCHEDULE_CSV, { status: 200 });
      })
    );
  };

  it('일정·안내 두 시트를 합쳐 읽는다', async () => {
    stubGoogle();
    const ref = parseSheetUrl('https://docs.google.com/spreadsheets/d/ID1/edit')!;
    const { itinerary, error, warnings } = parseItinerary(await sheetToItineraryText(ref));

    expect(error).toBeUndefined();
    expect(warnings).toEqual([]);
    expect(itinerary!.title).toBe('세부 2박3일 · 김기조님');
    expect(itinerary!.contacts).toEqual([
      { label: '현지가이드 제이', phone: '+63 917 555 0101' },
    ]);
    expect(itinerary!.notices).toHaveLength(2);
    expect(itinerary!.days).toHaveLength(2);
  });

  it('엑셀과 똑같은 규칙이 적용된다 (날짜 물려받기·장소·옵션·전화번호)', async () => {
    stubGoogle();
    const ref = parseSheetUrl('https://docs.google.com/spreadsheets/d/ID1/edit')!;
    const { itinerary } = parseItinerary(await sheetToItineraryText(ref));

    const day1 = itinerary!.days[0];
    expect(day1.label).toBe('1일차 · 출국');
    expect(day1.items).toHaveLength(3); // 날짜 칸이 빈 두 줄도 같은 날에 붙는다
    expect(day1.items[1].place).toBe('Bai Hotel Cebu, Mandaue City');
    expect(day1.items[2].note).toContain('+63 32 342 8888');

    const optional = itinerary!.days[1].items[0];
    expect(optional.optional).toBe(true);
    expect(optional.title).toBe('힐루뚱안 섬');
  });

  it('안내 시트가 없어도 일정만으로 동작한다', async () => {
    stubGoogle({ info: null });
    const ref = parseSheetUrl('https://docs.google.com/spreadsheets/d/ID1/edit')!;
    const { itinerary } = parseItinerary(await sheetToItineraryText(ref));
    expect(itinerary!.days).toHaveLength(2);
    expect(itinerary!.notices).toEqual([]);
  });

  it('공유가 안 열려 있으면 무엇을 해야 하는지 알려준다', async () => {
    // 구글은 권한이 없을 때 CSV 대신 로그인 HTML 을 200 으로 돌려줍니다.
    // 그대로 파싱하면 "일정 표를 찾지 못했습니다" 라는 엉뚱한 안내가 나갑니다.
    stubGoogle({ html: true });
    const ref = parseSheetUrl('https://docs.google.com/spreadsheets/d/ID1/edit')!;
    await expect(sheetToItineraryText(ref)).rejects.toThrow('링크가 있는 모든 사용자');
  });
});

describe('시트 연결 링크', () => {
  it('내용을 싣는 링크보다 훨씬 짧다', () => {
    const link = buildSheetLink(
      'https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit',
      'https://gijotour.github.io'
    );
    expect(link).toContain('#sheet=');
    // 내용을 통째로 싣는 #itin= 링크는 2,400자 안팎입니다.
    expect(link.length).toBeLessThan(200);
  });
});
