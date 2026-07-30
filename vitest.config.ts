import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * 테스트 설정을 vite.config.ts 와 분리해 둡니다.
 * 앱 빌드 설정에 테스트 전용 옵션이 섞이지 않게 하기 위함입니다.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // 재생 엔진 테스트는 가짜 타이머를 쓰므로 넉넉하지 않아도 됩니다.
    testTimeout: 10_000,
  },
});
