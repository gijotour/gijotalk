import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

/**
 * drive.file 만 요청합니다.
 *
 * 예전에는 전체 `auth/drive`(사용자 Drive 전부 읽기/쓰기)도 함께 요청했습니다.
 * 그런데 이 앱은 자기가 만든 백업 파일만 다루므로 drive.file 로 충분하고,
 * 전체 drive 는 Google 의 "제한된 범위(restricted scope)" 라서
 *   · 동의 화면에 "Google Drive의 모든 파일 보기 및 관리" 가 떠 사용자가 겁먹고
 *   · 미검증 앱이면 아예 차단되는 경우가 많습니다.
 * drive.file 로 줄이면 앱이 만든 파일 목록 조회·업로드·삭제가 그대로 됩니다.
 */
provider.addScope('https://www.googleapis.com/auth/drive.file');

// 매번 계정을 고를 수 있게 합니다. 여러 구글 계정을 쓰는 사람이 많습니다.
provider.setCustomParameters({ prompt: 'select_account' });

let isSigningIn = false;
let cachedAccessToken: string | null = null;

/** 로그인 실패 원인을 사용자가 실제로 조치할 수 있는 문장으로 바꿉니다. */
export class GoogleAuthError extends Error {
  constructor(
    message: string,
    /** 화면에 함께 보여줄 조치 안내 */
    readonly hint?: string,
    readonly code?: string
  ) {
    super(message);
    this.name = 'GoogleAuthError';
  }
}

function describeAuthError(error: unknown): GoogleAuthError {
  const code =
    (error as { code?: string })?.code ??
    (typeof error === 'object' && error && 'message' in error
      ? String((error as Error).message)
      : '');
  const host = typeof window !== 'undefined' ? window.location.hostname : '';

  switch (code) {
    case 'auth/unauthorized-domain':
      return new GoogleAuthError(
        `이 주소(${host})에서는 아직 Google 로그인이 허용되지 않았습니다.`,
        `Firebase 콘솔 → Authentication → Settings → 승인된 도메인에 "${host}" 를 추가해야 합니다.`,
        code
      );

    case 'auth/operation-not-allowed':
      return new GoogleAuthError(
        'Google 로그인이 이 프로젝트에서 꺼져 있습니다.',
        'Firebase 콘솔 → Authentication → Sign-in method 에서 Google 공급자를 사용 설정하세요.',
        code
      );

    case 'auth/popup-blocked':
      return new GoogleAuthError(
        '브라우저가 로그인 창을 막았습니다.',
        '주소창의 팝업 차단을 허용한 뒤 다시 시도해 주세요.',
        code
      );

    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return new GoogleAuthError('로그인 창이 닫혔습니다. 다시 시도해 주세요.', undefined, code);

    case 'auth/network-request-failed':
      return new GoogleAuthError(
        '네트워크에 연결할 수 없습니다.',
        'Drive 백업은 인터넷이 필요합니다. 회화·발음은 오프라인에서도 그대로 동작합니다.',
        code
      );

    case 'auth/internal-error':
      return new GoogleAuthError(
        'Google 로그인 처리 중 오류가 발생했습니다.',
        '동의 화면에서 Drive 권한을 거부했거나, 테스트 사용자로 등록되지 않았을 수 있습니다.',
        code
      );

    default:
      return new GoogleAuthError(
        'Google 로그인에 실패했습니다.',
        code ? `오류 코드: ${code}` : undefined,
        code
      );
  }
}

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Firebase 세션은 남아 있지만 Drive 접근 토큰은 메모리에만 있어
        // 새로고침하면 사라집니다. 다시 로그인해야 합니다.
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new GoogleAuthError(
        'Drive 접근 권한을 받지 못했습니다.',
        '로그인 창에서 Google Drive 권한 요청에 "허용"을 눌러야 합니다.'
      );
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('[GIJO Talk] Google 로그인 실패:', error);
    throw error instanceof GoogleAuthError ? error : describeAuthError(error);
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};
