// 바이트를 압축·해제 스트림에 통과시키는 작은 도우미.
//
// ⚠️ Blob(...).stream() 을 쓰면 안 됩니다.
//    브라우저에서는 되지만 테스트 환경(jsdom)의 Blob 에는 stream() 이 없습니다.
//    그래서 압축 경로가 테스트에서 조용히 건너뛰어지고, 실제로는 한 번도
//    검증되지 않은 채로 배포됩니다. ReadableStream 을 직접 만들면 양쪽에서
//    같은 코드가 돕니다.

export type ByteTransform = ReadableWritablePair<Uint8Array, Uint8Array>;

function sourceOf(data: Uint8Array): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    },
  });
}

async function collect(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      total += value.length;
    }
  }

  const out = new Uint8Array(total);
  let at = 0;
  for (const chunk of chunks) {
    out.set(chunk, at);
    at += chunk.length;
  }
  return out;
}

/** 바이트 뭉치를 변환 스트림(gzip·deflate 등)에 통과시킵니다. */
export function transformBytes(data: Uint8Array, transform: ByteTransform): Promise<Uint8Array> {
  return collect(sourceOf(data).pipeThrough(transform));
}
