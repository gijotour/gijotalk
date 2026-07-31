import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  parseItinerary,
  toMinutes,
  findNextItem,
  formatCountdown,
  tripNow,
  shortDate,
  splitDayChip,
  splitPhones,
} from './itinerary';

const SAMPLE = `#기조톡일정 v1
# 설명 줄은 무시됩니다

제목: 세부 4박5일 · 김기조님 외 3명
기간: 2026-08-01 ~ 2026-08-02
연락처: 현지가이드 홍길동 | +63 917 123 4567
연락처: 한국 사무실

[특이사항]
여권 유효기간 6개월 이상
- 우비를 챙기세요

[2026-08-01] 1일차 · 출국
06:30 | 집합 | 인천공항 3층 M카운터 | 여권 지참
09:20 | 항공 | PR469 인천 → 세부
13:40 | 이동 | 공항에서 호텔로 @Bai Hotel Cebu, Mandaue City
- | 자유 | 저녁은 각자

[8/2] 2일차 · 호핑투어
07:00 | 투어 | 힐루뚱안 섬 @Hilutungan Island
`;

describe('parseItinerary', () => {
  it('양식 파일이 아니면 거부한다', () => {
    const result = parseItinerary('그냥 메모입니다\n내일 10시 집합');
    expect(result.itinerary).toBeNull();
    expect(result.error).toContain('기조톡 일정표 파일이 아닙니다');
  });

  it('빈 파일도 거부한다', () => {
    expect(parseItinerary('').itinerary).toBeNull();
  });

  it('머리말·특이사항·연락처를 읽는다', () => {
    const { itinerary, warnings } = parseItinerary(SAMPLE);
    expect(warnings).toEqual([]);
    expect(itinerary).not.toBeNull();
    expect(itinerary!.title).toBe('세부 4박5일 · 김기조님 외 3명');
    expect(itinerary!.period).toBe('2026-08-01 ~ 2026-08-02');
    expect(itinerary!.notices).toEqual(['여권 유효기간 6개월 이상', '우비를 챙기세요']);
    expect(itinerary!.contacts).toEqual([
      { label: '현지가이드 홍길동', phone: '+63 917 123 4567' },
      { label: '한국 사무실', phone: undefined },
    ]);
  });

  it('일정 줄을 시간·종류·내용·메모로 나눈다', () => {
    const { itinerary } = parseItinerary(SAMPLE);
    const day1 = itinerary!.days[0];
    expect(day1.date).toBe('2026-08-01');
    expect(day1.label).toBe('1일차 · 출국');
    expect(day1.items[0]).toEqual({
      time: '06:30',
      minutes: 390,
      kind: '집합',
      title: '인천공항 3층 M카운터',
      place: undefined,
      note: '여권 지참',
    });
  });

  it('@ 뒤를 장소로 떼어낸다', () => {
    const { itinerary } = parseItinerary(SAMPLE);
    const move = itinerary!.days[0].items[2];
    expect(move.title).toBe('공항에서 호텔로');
    expect(move.place).toBe('Bai Hotel Cebu, Mandaue City');
  });

  it('시간이 - 이면 시간 없이 읽는다', () => {
    const { itinerary } = parseItinerary(SAMPLE);
    const free = itinerary!.days[0].items[3];
    expect(free.time).toBeUndefined();
    expect(free.minutes).toBeUndefined();
    expect(free.kind).toBe('자유');
  });

  it('짧은 날짜([8/2])의 연도는 기간에서 가져온다', () => {
    const { itinerary } = parseItinerary(SAMPLE);
    expect(itinerary!.days[1].date).toBe('2026-08-02');
  });

  it('날짜 순으로 세운다', () => {
    const { itinerary } = parseItinerary(
      `#기조톡일정 v1
기간: 2026-08-01 ~ 2026-08-03
[8/3] 3일차
09:00 | 기타 | 나중
[8/1] 1일차
09:00 | 기타 | 먼저`
    );
    expect(itinerary!.days.map((d) => d.date)).toEqual(['2026-08-01', '2026-08-03']);
  });

  it('모르는 줄은 건너뛰되 나머지는 살린다', () => {
    const { itinerary, warnings } = parseItinerary(
      `#기조톡일정 v1
제목: 테스트
이건 무슨 줄인지 모르겠음
[2026-08-01] 1일차
09:00 | 기타 | 살아남은 일정`
    );
    expect(itinerary!.days[0].items).toHaveLength(1);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('알 수 없는 형식');
  });

  it('날짜를 못 읽은 구역의 일정이 앞 날짜에 섞이지 않는다', () => {
    const { itinerary, warnings } = parseItinerary(
      `#기조톡일정 v1
[2026-08-01] 1일차
09:00 | 기타 | 1일차 일정
[셋째날] 잘못 적은 날짜
09:00 | 기타 | 붙으면 안 되는 일정`
    );
    expect(itinerary!.days).toHaveLength(1);
    expect(itinerary!.days[0].items).toHaveLength(1);
    expect(warnings.some((w) => w.includes('날짜를 알아보지'))).toBe(true);
  });

  it('종류를 생략하거나 모르는 말을 써도 내용으로 살린다', () => {
    const { itinerary } = parseItinerary(
      `#기조톡일정 v1
[2026-08-01] 1일차
09:00 | 그냥 내용만 적음
10:00 | 골프 | 종류가 목록에 없음`
    );
    const [a, b] = itinerary!.days[0].items;
    expect(a).toMatchObject({ kind: '기타', title: '그냥 내용만 적음' });
    expect(b).toMatchObject({ kind: '기타', title: '골프', note: '종류가 목록에 없음' });
  });

  // 가이드마다 쓰는 단어가 다릅니다. 실제 시트에서 공항·관광·마사지·교통이 나왔습니다.
  it('가이드가 흔히 쓰는 다른 표현도 대표 종류로 알아본다', () => {
    const { itinerary } = parseItinerary(
      `#기조톡일정 v1
[2026-08-01] 1일차
09:00 | 공항 | 인천공항 출발
10:00 | 교통 | 밴으로 이동
11:00 | 관광 | 시내 명소
12:00 | 마사지 | 힐링 스파`
    );
    expect(itinerary!.days[0].items.map((i) => i.kind)).toEqual([
      '항공',
      '이동',
      '투어',
      '스파',
    ]);
  });

  it('BOM 과 윈도우 줄바꿈이 붙어도 읽는다', () => {
    const { itinerary } = parseItinerary('﻿#기조톡일정 v1\r\n제목: 메모장 저장본\r\n[2026-08-01] 1일차\r\n09:00 | 기타 | 일정');
    expect(itinerary!.title).toBe('메모장 저장본');
    expect(itinerary!.days[0].items[0].title).toBe('일정');
  });
});

describe('옵션 일정', () => {
  const parsed = parseItinerary(
    `#기조톡일정 v1
[2026-08-01] 1일차
09:00 | 투어 | (옵션) 오슬롭 고래상어 - 1인 3500페소 | 신청자만
10:00 | 식사 | [선택] 단체 회식 @Sutukil
11:00 | 이동 | 호텔 복귀`
  ).itinerary!;
  const items = parsed.days[0].items;

  it('"(옵션)" 표기를 알아보고 제목에서 떼어낸다', () => {
    expect(items[0].optional).toBe(true);
    expect(items[0].title).toBe('오슬롭 고래상어 - 1인 3500페소');
  });

  it('[선택] 같은 변형도 알아본다', () => {
    expect(items[1].optional).toBe(true);
    expect(items[1].title).toBe('단체 회식');
    expect(items[1].place).toBe('Sutukil');
  });

  it('확정 일정에는 붙지 않는다', () => {
    expect(items[2].optional).toBeUndefined();
  });

  it('"다음 일정" 알림에서 빠진다 — 신청 안 한 사람에게는 오알림이다', () => {
    // 08:00 기준으로 가장 이른 건 09:00 옵션이지만, 알려야 할 건 11:00 확정 일정입니다.
    expect(findNextItem(parsed.days[0], 8 * 60)?.title).toBe('호텔 복귀');
  });
});

describe('splitPhones', () => {
  it('국제표기 번호를 찾는다', () => {
    expect(splitPhones('프런트 +63 32 342 8888 로 연락')).toEqual([
      { text: '프런트 ' },
      { text: '+63 32 342 8888', phone: '+63323428888' },
      { text: ' 로 연락' },
    ]);
  });

  it('한국식 번호를 찾는다', () => {
    expect(splitPhones('박대리 010-2345-6789')[1]).toEqual({
      text: '010-2345-6789',
      phone: '01023456789',
    });
  });

  it('날짜·금액·좌석번호를 번호로 오인하지 않는다', () => {
    for (const text of ['2026-08-01 출발', '1인 3500페소', '좌석 32A~32D', '수하물 23kg']) {
      expect(splitPhones(text)).toEqual([{ text }]);
    }
  });

  it('번호가 없으면 통째로 한 조각이다', () => {
    expect(splitPhones('여권 지참')).toEqual([{ text: '여권 지참' }]);
  });
});

describe('toMinutes', () => {
  it.each([
    ['06:30', 390],
    ['6:30', 390],
    ['0630', 390],
    ['9시', 540],
    ['9시 15분', 555],
    ['오후 2시', 840],
    ['오전 12시', 0],
    ['오후 12시', 720],
  ])('%s → %i', (input, expected) => {
    expect(toMinutes(input)).toBe(expected);
  });

  it('읽을 수 없으면 undefined', () => {
    expect(toMinutes('아침')).toBeUndefined();
    expect(toMinutes('25:00')).toBeUndefined();
    expect(toMinutes(undefined)).toBeUndefined();
  });
});

describe('findNextItem', () => {
  const day = parseItinerary(SAMPLE).itinerary!.days[0];

  it('지금 이후로 가장 이른 일정을 고른다', () => {
    expect(findNextItem(day, 7 * 60)?.time).toBe('09:20');
  });

  it('그날 일정이 다 지났으면 없다', () => {
    expect(findNextItem(day, 23 * 60)).toBeUndefined();
  });

  it('시간이 없는 항목은 후보에서 뺀다', () => {
    expect(findNextItem(day, 14 * 60)).toBeUndefined();
  });
});

describe('formatCountdown', () => {
  it.each([
    [390, 400, '10분 뒤'],
    [390, 450, '1시간 뒤'],
    [390, 520, '2시간 10분 뒤'],
    [390, 390, '지금'],
  ])('%i → %i = %s', (from, to, expected) => {
    expect(formatCountdown(from, to)).toBe(expected);
  });
});

describe('tripNow', () => {
  it('기기 시간대가 아니라 현지(UTC+9 한국 자정 직후 = 아직 전날 밤)를 기준으로 본다', () => {
    // 2026-08-02 00:30 KST = 2026-08-01 23:30 필리핀 시간
    const result = tripNow(new Date('2026-08-01T15:30:00Z'));
    expect(result.date).toBe('2026-08-01');
    expect(result.minutes).toBe(23 * 60 + 30);
  });
});

// 배포되는 양식 파일이 스스로를 통과하지 못하면, 가이드가 예시를 그대로 고쳐 쓴
// 파일도 통과하지 못합니다. 양식과 파서가 어긋나는 걸 여기서 잡습니다.
describe('배포되는 양식 파일', () => {
  const template = fs.readFileSync(
    path.join(process.cwd(), 'public', 'itinerary-template.txt'),
    'utf8'
  );

  it('UTF-8 BOM 으로 시작한다 (윈도우 메모장 한글 깨짐 회귀)', () => {
    // BOM 이 없으면 메모장이 ANSI(CP949)로 열어 한글이 통째로 깨집니다.
    // 서버 헤더의 charset=utf-8 은 내려받은 파일 안에 남지 않아 소용없습니다.
    const bytes = fs.readFileSync(
      path.join(process.cwd(), 'public', 'itinerary-template.txt')
    );
    expect([bytes[0], bytes[1], bytes[2]]).toEqual([0xef, 0xbb, 0xbf]);
  });

  it('경고 하나 없이 읽힌다', () => {
    const { itinerary, warnings, error } = parseItinerary(template);
    expect(error).toBeUndefined();
    expect(warnings).toEqual([]);
    expect(itinerary!.days).toHaveLength(5);
    expect(itinerary!.notices).toHaveLength(3);
    expect(itinerary!.contacts).toHaveLength(2);
  });

  it('예시에 장소(@)와 회화로 이어지는 종류가 들어 있다', () => {
    const { itinerary } = parseItinerary(template);
    const items = itinerary!.days.flatMap((d) => d.items);
    expect(items.some((it) => it.place)).toBe(true);
    expect(items.some((it) => it.kind === '이동')).toBe(true);
  });
});

describe('shortDate', () => {
  it('요일을 붙여 짧게 만든다', () => {
    expect(shortDate('2026-08-01')).toBe('8/1 (토)');
  });
});

describe('splitDayChip', () => {
  it('날짜와 요일을 나눈다 — 칩을 두 줄로 세워 폭을 줄입니다', () => {
    expect(splitDayChip('2026-08-01')).toEqual(['8/1', '토']);
    expect(splitDayChip('2026-12-25')).toEqual(['12/25', '금']);
  });

  it('날짜 모양이 아니면 그대로 둔다', () => {
    expect(splitDayChip('셋째날')).toEqual(['셋째날', '']);
  });
});
