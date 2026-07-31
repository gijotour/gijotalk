// 일정표를 링크 하나에 통째로 싣기.
//
// ── 왜 링크인가
//   서버가 없으니 "가이드가 고치면 모두에게 자동 반영" 은 불가능합니다.
//   대신 일정표 전체를 URL 프래그먼트(#)에 실으면, 가이드가 카톡방에 링크를
//   한 번 붙여넣는 것으로 누른 사람 전원이 같은 일정표를 갖게 됩니다.
//   서버도, 계정도, 파일 첨부도 없이 체감상 "전체 반영" 에 가장 가까운 방법입니다.
//
// ── 왜 프래그먼트(#)인가
//   # 뒤는 브라우저가 서버로 보내지 않습니다. 실명·항공편·숙소가 적힌 일정표가
//   호스팅 서버 접근 로그에 남지 않습니다.
//
// ── 한계 (숨기지 말 것)
//   · 링크를 가진 사람은 누구나 봅니다. 공개 채팅방에 올릴 물건이 아닙니다.
//   · 이미 받은 사람에게 밀어넣지는 못합니다. 고치면 새 링크를 다시 보내야 합니다.

import { BASE_URL } from './env';
import { ByteTransform, transformBytes } from './bytes';

const HASH_PREFIX = '#itin=';

/**
 * 구글시트 연결 링크.
 *
 * #itin= 은 일정표 내용을 통째로 실어 2천 자가 넘습니다. 시트는 주소만 실으면
 * 되므로 링크가 100자 안팎으로 짧아지고, 무엇보다 가이드가 시트를 고치면
 * 여행자 앱이 알아서 최신 내용을 받아옵니다.
 */
const SHEET_PREFIX = '#sheet=';

/** gzip 압축본 / 무압축본 구분자. 오래된 사파리에는 CompressionStream 이 없습니다. */
const TAG_GZIP = 'Z';
const TAG_PLAIN = 'P';

/** 디코딩할 최대 크기. 이상한 링크로 메모리를 밀어넣지 못하게 막습니다. */
const MAX_DECODED_BYTES = 512 * 1024;

/* ------------------------------------------------------------------ */
/* base64url                                                          */
/* ------------------------------------------------------------------ */

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  // 한 번에 넘기면 인자 개수 제한에 걸리므로 조각내서 붙입니다.
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/* ------------------------------------------------------------------ */
/* 압축                                                                */
/* ------------------------------------------------------------------ */

type StreamCtor = new (format: string) => ByteTransform;

const compressionAvailable = (): boolean =>
  typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';

function pipe(bytes: Uint8Array, Ctor: StreamCtor): Promise<Uint8Array> {
  return transformBytes(bytes, new Ctor('gzip'));
}

/* ------------------------------------------------------------------ */
/* 인코딩 / 디코딩                                                      */
/* ------------------------------------------------------------------ */

/**
 * 링크에 싣기 전에 군더더기를 뺍니다.
 *
 * 양식 파일은 절반이 사용법 주석입니다. 파서가 어차피 버리는 줄이라 실어 보낼
 * 이유가 없는데, 그대로 두면 링크가 300자쯤 길어져 채팅창에서 보기 흉해집니다.
 * 첫 줄(#기조톡일정)은 파일을 알아보는 표식이라 남깁니다.
 */
export function compactForLink(text: string): string {
  const lines = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n');
  const head = lines.findIndex((l) => l.trim().length > 0);
  if (head === -1) return text;

  const kept = [lines[head].trim()];
  let blank = false;

  for (const line of lines.slice(head + 1)) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) continue;
    // 빈 줄이 연달아 나오면 하나로 줄입니다.
    if (!trimmed) {
      if (!blank) kept.push('');
      blank = true;
      continue;
    }
    blank = false;
    kept.push(trimmed);
  }

  return kept.join('\n');
}

/** 일정표 원문(.txt 내용) → 링크에 실을 문자열 */
export async function encodeItineraryPayload(text: string): Promise<string> {
  const raw = new TextEncoder().encode(compactForLink(text));

  if (compressionAvailable()) {
    try {
      return TAG_GZIP + toBase64Url(await pipe(raw, CompressionStream as unknown as StreamCtor));
    } catch {
      // 압축에 실패해도 링크는 만들어져야 합니다. 조금 길어질 뿐입니다.
    }
  }
  return TAG_PLAIN + toBase64Url(raw);
}

/** 링크에 실린 문자열 → 일정표 원문 */
export async function decodeItineraryPayload(payload: string): Promise<string> {
  const tag = payload.slice(0, 1);
  const body = payload.slice(1);
  if ((tag !== TAG_GZIP && tag !== TAG_PLAIN) || !body) {
    throw new Error('일정표 링크가 아닙니다.');
  }

  const bytes = fromBase64Url(body);
  if (bytes.length > MAX_DECODED_BYTES) throw new Error('일정표 링크가 너무 큽니다.');

  if (tag === TAG_PLAIN) return new TextDecoder().decode(bytes);

  if (!compressionAvailable()) {
    throw new Error('이 브라우저에서는 링크를 풀 수 없습니다. 파일로 받아 올려주세요.');
  }
  const out = await pipe(bytes, DecompressionStream as unknown as StreamCtor);
  if (out.length > MAX_DECODED_BYTES) throw new Error('일정표 링크가 너무 큽니다.');
  return new TextDecoder().decode(out);
}

/* ------------------------------------------------------------------ */
/* 주소창 다루기                                                        */
/* ------------------------------------------------------------------ */

/** 카톡방에 붙여넣을 전체 링크 */
export async function buildItineraryLink(text: string, origin?: string): Promise<string> {
  const base = origin ?? (typeof location !== 'undefined' ? location.origin : '');
  return `${base}${BASE_URL}${HASH_PREFIX}${await encodeItineraryPayload(text)}`;
}

/** 카톡방에 붙여넣을 구글시트 연결 링크 */
export function buildSheetLink(sheetUrl: string, origin?: string): string {
  const base = origin ?? (typeof location !== 'undefined' ? location.origin : '');
  return `${base}${BASE_URL}${SHEET_PREFIX}${toBase64Url(new TextEncoder().encode(sheetUrl))}`;
}

/**
 * 지금 열린 주소에 일정표가 실려 있는지 (동기 — 첫 화면 탭을 정하는 데 씁니다).
 * 내용을 실은 링크든 시트 연결 링크든 "일정 보러 온 사람" 인 건 같습니다.
 */
export function hasItineraryLink(): boolean {
  if (typeof location === 'undefined') return false;
  return location.hash.startsWith(HASH_PREFIX) || location.hash.startsWith(SHEET_PREFIX);
}

export function readItineraryLink(): string | null {
  if (typeof location === 'undefined' || !location.hash.startsWith(HASH_PREFIX)) return null;
  return location.hash.slice(HASH_PREFIX.length);
}

/** 시트 연결 링크로 들어왔다면 그 시트 주소 */
export function readSheetLink(): string | null {
  if (typeof location === 'undefined' || !location.hash.startsWith(SHEET_PREFIX)) return null;
  try {
    const decoded = new TextDecoder().decode(fromBase64Url(location.hash.slice(SHEET_PREFIX.length)));
    return decoded || null;
  } catch {
    return null;
  }
}

/**
 * 주소창에서 일정표를 지웁니다.
 * 한 번 저장한 뒤에도 남겨두면 주소가 수천 자로 길어져 공유·새로고침이 지저분해집니다.
 */
export function clearItineraryLink(): void {
  try {
    history.replaceState(null, '', location.pathname + location.search);
  } catch {
    // 히스토리 조작이 막힌 환경이면 주소가 길게 남을 뿐, 동작에는 지장이 없습니다.
  }
}
