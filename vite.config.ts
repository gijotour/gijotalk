import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // GitHub Pages 는 https://<user>.github.io/<repo>/ 처럼 서브패스로 서빙됩니다.
    // Cloud Run 같은 루트 배포에서는 BASE_PATH 를 비워두면 됩니다.
    //   Pages:     BASE_PATH=/<저장소이름>/ npm run build   (워크플로가 자동으로 넣습니다)
    //   Cloud Run: npm run build
    base: process.env.BASE_PATH || '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // 한 덩어리(593KB)였던 번들을 셋으로 나눕니다. 문장 데이터(src/data)만 고쳐도
      // react 벤더 청크는 해시가 안 바뀌어 사용자가 다시 받지 않습니다.
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'vendor-react';
            if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
            if (id.includes('/src/data/')) return 'phrases';
            return undefined;
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
