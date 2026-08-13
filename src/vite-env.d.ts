/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 배포 기준 경로. GitHub Pages 는 '/<저장소이름>/', 루트 배포는 '/' */
  readonly BASE_URL: string;
  /** 정적 호스팅 빌드 여부 — 서버가 필요한 기능을 숨깁니다 */
  readonly VITE_STATIC_BUILD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
