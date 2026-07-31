import { describe, it, expect } from 'vitest';
import {
  encodeItineraryPayload,
  decodeItineraryPayload,
  buildItineraryLink,
} from './itineraryLink';
import { parseItinerary } from './itinerary';

const SAMPLE = `#기조톡일정 v1
제목: 세부 4박5일 · 김기조님 외 3명
기간: 2026-08-01 ~ 2026-08-02
연락처: 현지가이드 제이 | +63 917 555 0101

[특이사항]
여권 유효기간 6개월 이상

[2026-08-01] 1일차 · 출국
06:30 | 집합 | 인천공항 3층 M카운터 | 여권 지참
13:40 | 이동 | 공항에서 호텔로 @Bai Hotel Cebu, Mandaue City

[2026-08-02] 2일차 · 호핑투어
08:00 | 투어 | (옵션) 힐루뚱안 섬 @Hilutungan Island | 1인 1500페소
`;

describe('일정표 링크', () => {
  it('실어 보냈다가 풀면 원문 그대로다', async () => {
    const payload = await encodeItineraryPayload(SAMPLE);
    expect(await decodeItineraryPayload(payload)).toBe(SAMPLE);
  });

  it('압축 경로를 실제로 탄다', async () => {
    // 'Z' = gzip. 예전에는 Blob.stream() 이 테스트 환경에 없어서 조용히 무압축('P')으로
    // 떨어졌고, 그래서 압축 경로가 한 번도 검증되지 않은 채로 배포됐습니다.
    const payload = await encodeItineraryPayload(SAMPLE);
    expect(payload.startsWith('Z')).toBe(true);

    // 압축이 실제로 먹었는지 — 무압축으로 실었을 때보다 짧아야 합니다.
    // (base64 는 3바이트를 4글자로 늘리므로 원문 바이트 수와 비교하면 안 됩니다)
    const rawBytes = new TextEncoder().encode(SAMPLE).length;
    expect(payload.length).toBeLessThan(Math.ceil((rawBytes * 4) / 3));
  });

  it('한글·이모지·긴 공백이 깨지지 않는다', async () => {
    const tricky = '#기조톡일정 v1\n제목: 🇵🇭 세부 · 100% 확정  (두 칸 공백)\n[2026-08-01] 1일차\n09:00 | 기타 | 「집합」 ※ 지각 금지';
    expect(await decodeItineraryPayload(await encodeItineraryPayload(tricky))).toBe(tricky);
  });

  it('풀어낸 원문이 원래와 똑같이 파싱된다', async () => {
    const restored = await decodeItineraryPayload(await encodeItineraryPayload(SAMPLE));
    const before = parseItinerary(SAMPLE).itinerary!;
    const after = parseItinerary(restored).itinerary!;

    expect(after.title).toBe(before.title);
    expect(after.days).toEqual(before.days);
    expect(after.notices).toEqual(before.notices);
    expect(after.contacts).toEqual(before.contacts);
  });

  it('링크가 카톡에 붙여넣을 만한 길이다', async () => {
    const link = await buildItineraryLink(SAMPLE, 'https://gijotour.github.io');
    expect(link).toContain('#itin=');
    // 브라우저 주소 길이 한계(대략 2000자)를 넘으면 링크 방식이 성립하지 않습니다.
    expect(link.length).toBeLessThan(2000);
  });

  it('무압축본도 읽는다 — CompressionStream 없는 옛 사파리 대비', async () => {
    // 'P' 태그 = 압축하지 않은 base64url
    const bytes = new TextEncoder().encode('#기조톡일정 v1\n제목: 무압축');
    const b64 = btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(await decodeItineraryPayload('P' + b64)).toBe('#기조톡일정 v1\n제목: 무압축');
  });

  it('설명 주석은 싣지 않는다 — 링크만 길어지고 파서는 어차피 버린다', async () => {
    const withComments = `#기조톡일정 v1
# 이 줄은 사용법 설명입니다
# 이것도 설명입니다

제목: 주석 많은 일정표


[2026-08-01] 1일차
# 여기도 설명
09:00 | 기타 | 집합`;

    const restored = await decodeItineraryPayload(await encodeItineraryPayload(withComments));
    expect(restored).not.toContain('사용법 설명');
    expect(restored).toContain('#기조톡일정 v1'); // 파일 표식은 남는다
    expect(parseItinerary(restored).itinerary!.days[0].items[0].title).toBe('집합');

    const short = await encodeItineraryPayload(withComments);
    const long = await encodeItineraryPayload(withComments.replace(/^# .*$/gm, '#'));
    expect(short.length).toBeLessThanOrEqual(long.length);
  });

  it('엉뚱한 링크는 거부한다', async () => {
    await expect(decodeItineraryPayload('')).rejects.toThrow('일정표 링크가 아닙니다');
    await expect(decodeItineraryPayload('X아무거나')).rejects.toThrow('일정표 링크가 아닙니다');
    await expect(decodeItineraryPayload('Z')).rejects.toThrow('일정표 링크가 아닙니다');
  });
});
