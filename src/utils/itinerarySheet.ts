// 구글시트 일정표 읽기.
//
// ── 이게 왜 중요한가
//   파일과 링크(#itin=)는 "그 순간의 사본" 입니다. 가이드가 일정을 고치면 새로
//   보내야 하고, 이미 받은 분 폰은 옛 일정을 그대로 들고 있습니다. 서버가 없으니
//   달리 방법이 없었습니다.
//
//   구글시트는 그 구멍을 메웁니다. 시트 주소만 들고 있으면 앱이 열릴 때마다
//   최신 내용을 직접 읽어옵니다. 가이드는 시트만 고치면 되고, 여행자는 아무것도
//   하지 않습니다 — 서버 없이 "전체 반영" 이 실제로 성립하는 유일한 경로입니다.
//
// ── 서버 없이 되는 이유
//   구글의 CSV 내보내기 엔드포인트가 CORS 를 열어둡니다(Access-Control-Allow-Origin
//   이 요청 출처를 그대로 돌려줍니다). 그래서 브라우저가 직접 가져올 수 있습니다.
//
// ── 대가 (숨기지 말 것)
//   · 시트가 "링크가 있는 모든 사용자에게 공개" 여야 합니다. 주소를 아는 사람은
//     누구나 봅니다. 여권번호처럼 민감한 것은 넣지 마세요.
//   · 최신 내용을 받으려면 인터넷이 필요합니다. 없으면 마지막으로 받아둔 내용을
//     그대로 씁니다 — 현지에서 앱이 비는 일은 없습니다.

import { Grid, gridsToItineraryText } from './itineraryGrid';

/** 시트가 어떤 방식으로 열려 있는지 */
export interface SheetRef {
  /** 문서 ID 또는 게시 ID */
  id: string;
  /** doc = /d/<id> (링크 공유) · pub = /d/e/<id> (웹에 게시) */
  kind: 'doc' | 'pub';
  /** 주소에 탭이 지정돼 있으면 그 탭 (없으면 첫 탭) */
  gid?: string;
}

/** 시트가 아무리 커도 일정표가 이 이상일 수는 없습니다 */
const MAX_CSV_BYTES = 1_000_000;

/* ------------------------------------------------------------------ */
/* 주소 해석                                                           */
/* ------------------------------------------------------------------ */

/**
 * 구글시트 주소에서 문서를 알아냅니다.
 *
 * 가이드는 주소창을 그대로 복사해 옵니다. 편집 주소·공유 주소·게시 주소가
 * 전부 다르게 생겼으므로 다 받아줍니다.
 *   https://docs.google.com/spreadsheets/d/<ID>/edit#gid=0
 *   https://docs.google.com/spreadsheets/d/<ID>/edit?usp=sharing
 *   https://docs.google.com/spreadsheets/d/e/<PUBID>/pubhtml
 */
export function parseSheetUrl(url: string): SheetRef | null {
  const text = url.trim();
  if (!/^https?:\/\/docs\.google\.com\/spreadsheets\//i.test(text)) return null;

  // 주소창을 복사해 오면 보통 "#gid=0" 이 붙어 옵니다. 탭이 여러 개인 문서에서
  // 어느 탭을 보고 있었는지가 그 안에 들어 있으므로 살려둡니다.
  const gid = text.match(/[#&?]gid=(\d+)/)?.[1];

  // 게시 주소(/d/e/...)를 먼저 봅니다 — /d/ 규칙이 먼저 걸리면 e 를 ID 로 잡습니다.
  const pub = text.match(/\/spreadsheets\/d\/e\/([\w-]+)/);
  if (pub) return { id: pub[1], kind: 'pub', gid };

  const doc = text.match(/\/spreadsheets\/d\/([\w-]+)/);
  if (doc) return { id: doc[1], kind: 'doc', gid };

  return null;
}

/** 사람이 보기 좋은 원래 주소 (저장해 두고 화면에 보여줍니다) */
export function sheetHomeUrl(ref: SheetRef): string {
  return ref.kind === 'pub'
    ? `https://docs.google.com/spreadsheets/d/e/${ref.id}/pubhtml`
    : `https://docs.google.com/spreadsheets/d/${ref.id}/edit`;
}

/**
 * 시트를 CSV 로 받는 주소.
 *
 * ⚠️ gviz(/gviz/tq?tqx=out:csv)를 쓰면 안 됩니다.
 *    그건 질의 엔진이라 시트 위쪽 여러 줄을 통째로 "머리글" 하나로 뭉쳐버립니다.
 *    실제 시트에서 안내 블록 11줄과 표 머리글이 한 줄로 합쳐지면서 "날짜" 열이
 *    사라졌고, 앱은 "읽을 수 있는 일정이 없습니다" 만 뱉었습니다.
 *    export 는 질의 엔진을 거치지 않고 시트를 적힌 그대로 내려줍니다.
 */
export function csvUrl(ref: SheetRef): string {
  const gid = ref.gid ? `&gid=${ref.gid}` : '';
  return ref.kind === 'pub'
    ? `https://docs.google.com/spreadsheets/d/e/${ref.id}/pub?output=csv${gid}`
    : `https://docs.google.com/spreadsheets/d/${ref.id}/export?format=csv${gid}`;
}

/* ------------------------------------------------------------------ */
/* CSV 해석                                                            */
/* ------------------------------------------------------------------ */

/**
 * CSV → 2차원 배열.
 *
 * 따옴표 안의 쉼표·줄바꿈·이중따옴표를 제대로 다뤄야 합니다. 메모 칸에 쉼표를
 * 쓰는 건 아주 흔한 일이라(“보증금 2000페소, 프런트 …”), 단순히 쉼표로 자르면
 * 그 줄부터 통째로 어긋납니다.
 */
export function parseCsv(text: string): Grid {
  const rows: Grid = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  const clean = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n');

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];

    if (quoted) {
      if (ch === '"') {
        // "" 는 따옴표 한 개를 뜻합니다.
        if (clean[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += ch;
      continue;
    }

    if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += ch;
  }

  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.map((r) => r.map((c) => c.trim()));
}

/* ------------------------------------------------------------------ */
/* 가져오기                                                            */
/* ------------------------------------------------------------------ */

async function fetchCsv(url: string, signal?: AbortSignal): Promise<Grid | null> {
  const res = await fetch(url, { signal, redirect: 'follow' });
  if (!res.ok) return null;

  const text = await res.text();
  if (text.length > MAX_CSV_BYTES) throw new Error('시트가 너무 큽니다.');

  // 권한이 없으면 구글은 CSV 대신 로그인 HTML 을 200 으로 돌려줍니다.
  // 그대로 파싱하면 "일정 표를 찾지 못했습니다" 라는 엉뚱한 안내가 나갑니다.
  if (/^\s*<(!doctype|html)/i.test(text)) {
    throw new Error(
      '시트를 열 수 없습니다. 구글시트에서 [공유] → "링크가 있는 모든 사용자" 로 바꿔주세요.'
    );
  }
  return parseCsv(text);
}

/**
 * 구글시트 → 양식 텍스트.
 * 결과는 그대로 parseItinerary 에 넘길 수 있습니다.
 */
export async function sheetToItineraryText(
  ref: SheetRef,
  signal?: AbortSignal
): Promise<string> {
  const grid = await fetchCsv(csvUrl(ref), signal);
  if (!grid) {
    throw new Error(
      '시트를 읽지 못했습니다. [공유] → "링크가 있는 모든 사용자" 로 열려 있는지 확인해 주세요.'
    );
  }

  // 같은 시트를 일정표와 안내 양쪽으로 읽습니다.
  //
  //   구글시트는 탭 하나로 쓰는 경우가 대부분입니다. 제목·기간·연락처·특이사항을
  //   표 위쪽에 적어두면 그대로 읽히고, 없으면 일정만 읽힙니다. 안내 블록의 줄들은
  //   일정 표 쪽에서 머리글로도 항목으로도 잡히지 않으므로 서로 방해하지 않습니다.
  return gridsToItineraryText(grid, grid);
}
