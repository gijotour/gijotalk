import React, { useState, useRef } from 'react';
import { Country } from '../types';
import { Modal } from './Modal';
import { accessHeaders } from '../utils/accessCode';
import { track } from '../utils/analytics';
import { Camera, X, Loader2, AlertCircle, AlertTriangle, RefreshCw, ImageUp } from 'lucide-react';

interface OcrLine {
  original: string;
  translation: string;
  note?: string;
}

interface OcrResult {
  summary: string;
  lines: OcrLine[];
  caution?: string;
}

interface PhotoTranslateModalProps {
  country: Country;
  onClose: () => void;
}

/** 업로드 전에 긴 변을 1600px 로 줄입니다. 요즘 폰 사진은 그대로 보내면 5MB 가 넘습니다. */
const MAX_EDGE = 1600;

async function compressImage(file: File): Promise<{ base64: string; mimeType: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('이미지를 처리할 수 없습니다.');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
  return { base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' };
}

/**
 * 사진 번역.
 *
 * 회화집이 못 메우는 구멍을 메웁니다 — 여행자가 "찾는 문장이 없다"고 느끼는
 * 순간의 상당수는 사실 "눈앞의 글자를 못 읽겠다" 입니다. 메뉴판·표지판·약봉투.
 */
export const PhotoTranslateModal: React.FC<PhotoTranslateModalProps> = ({ country, onClose }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<OcrResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setResult(null);
    setLoading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const { base64, mimeType } = await compressImage(file);
      track('photo_translate', { lang: country.id });

      const res = await fetch('/api/gemini/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...accessHeaders() },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          countryName: country.name,
          language: country.language,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || '사진을 읽지 못했습니다.');
      }
      setResult(data.result as OcrResult);
    } catch (err: any) {
      setError(err?.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Modal
      onClose={onClose}
      label="사진 번역"
      panelClassName="bg-white border-2 border-orange-100 rounded-3xl max-w-lg w-full text-ink shadow-2xl max-h-[88vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-orange-100 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-brand rounded-xl text-white shrink-0">
            <Camera className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-sm">사진 번역</h3>
            <p className="text-xs text-ink-mute font-medium truncate">
              메뉴판 · 표지판 · 약봉투를 찍으면 읽어드립니다
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="p-2 text-ink-mute hover:text-ink rounded-full bg-slate-100 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-4 flex-1">
        {/* 촬영 / 선택 */}
        {!preview && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              id="gijo-photo-input"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <label
              htmlFor="gijo-photo-input"
              className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 rounded-2xl py-12 cursor-pointer hover:border-brand hover:bg-brand-tint transition-colors"
            >
              <div className="p-4 bg-brand text-white rounded-2xl">
                <Camera className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-ink">사진 찍기 / 앨범에서 고르기</p>
              <p className="text-xs text-ink-mute font-medium">글자가 잘 보이게 가까이 찍어주세요</p>
            </label>

            <p className="text-xs text-ink-mute font-medium leading-relaxed">
              이 기능은 인터넷이 필요합니다. 저장된 회화와 발음은 오프라인에서 그대로 동작합니다.
            </p>
          </>
        )}

        {/* 미리보기 */}
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="번역할 사진"
              className="w-full max-h-52 object-contain rounded-2xl bg-slate-100"
            />
            <button
              onClick={reset}
              className="absolute top-2 right-2 px-2.5 py-1.5 bg-ink/80 text-white text-xs font-bold rounded-xl flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              다시 찍기
            </button>
          </div>
        )}

        {loading && (
          <div className="py-8 flex flex-col items-center gap-2 text-ink-soft">
            <Loader2 className="w-6 h-6 animate-spin text-brand" />
            <span className="text-sm font-bold">사진을 읽는 중…</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 결과 */}
        {result && !loading && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-ink">{result.summary}</p>

            {result.caution && (
              <div className="p-3 bg-accent/20 border border-accent rounded-2xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-alert shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-ink leading-relaxed">{result.caution}</p>
              </div>
            )}

            {result.lines.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-2xl">
                <ImageUp className="w-8 h-8 text-ink-mute mx-auto mb-2" />
                <p className="text-xs text-ink-soft font-bold">
                  읽을 수 있는 글자를 찾지 못했습니다.
                </p>
                <p className="text-xs text-ink-mute font-medium mt-1">
                  더 밝은 곳에서, 글자에 가까이 다시 찍어보세요.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {result.lines.map((line, i) => (
                  <div key={i} className="bg-canvas border border-slate-200 rounded-2xl p-3">
                    <p className="text-xs text-ink-mute font-medium">{line.original}</p>
                    <p className="text-sm font-bold text-ink mt-0.5">{line.translation}</p>
                    {line.note && (
                      <p className="text-xs text-alert font-bold mt-1.5">💡 {line.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
