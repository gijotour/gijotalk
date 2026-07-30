/**
 * Vite 환경변수 안전 접근.
 *
 * `import.meta.env` 는 Vite 가 빌드 시점에 치환하는 값이라, Vite 를 거치지 않고
 * 파일을 직접 실행하면 undefined 입니다. 이 저장소의 scripts/*.ts (오디오 생성·
 * 동기화 검사)는 tsx 로 src/config 를 직접 import 하므로, 가드가 없으면
 *   TypeError: Cannot read properties of undefined (reading 'VITE_STATIC_BUILD')
 * 로 CI 가 죽습니다.
 */

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;

/** 배포 기준 경로. Vite 밖에서는 '/' 로 봅니다. */
export const BASE_URL: string = env?.BASE_URL ?? '/';

/**
 * 정적 호스팅(GitHub Pages) 빌드 여부.
 * Pages 에는 Express 서버가 없어 /api/* 를 부를 수 없으므로,
 * 서버가 필요한 기능(AI 맞춤 회화·사용 기록)을 버튼째로 숨깁니다.
 */
export const IS_STATIC_BUILD: boolean = env?.VITE_STATIC_BUILD === 'true';

/**
 * 가이드 모드(일정표 작성) 진입 코드.
 *
 * ⚠️ 이건 보안 장치가 아닙니다. 서버가 없어 코드가 앱 번들 안에 들어가므로
 *    마음먹고 뜯어보면 보입니다. 목적은 딱 하나 — 일반 여행자에게 편집 화면을
 *    보이지 않게 하는 것입니다. 각자 기기의 자기 일정을 고치는 것뿐이라
 *    새어나가도 실질적 피해가 없습니다.
 *
 *    바꾸려면 빌드할 때: VITE_GUIDE_CODE=원하는코드 npm run build
 */
export const GUIDE_CODE: string = env?.VITE_GUIDE_CODE || 'gijohn';
