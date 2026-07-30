import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {captureAccessCodeFromUrl} from './utils/accessCode';
import {initAnalytics} from './utils/analytics';
import './index.css';

// 링크에 담겨온 ?key= 를 저장하고 주소창에서 지웁니다.
// 렌더 전에 실행해야 홈 화면 추가 시점에 코드가 이미 저장되어 있습니다.
captureAccessCodeFromUrl();

// 세션 시작 기록. 사용자가 꺼두었으면 아무것도 하지 않습니다.
initAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
