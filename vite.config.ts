// vite.config.ts
import { defineConfig, loadEnv } from 'vite' // loadEnv 추가
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // .env 파일의 환경 변수를 불러오기 위해 loadEnv 사용
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        // '/api'로 시작하는 요청을 백엔드 서버로 프록시
        // 주의: VITE_API_BASE_URL이 '/api'를 포함하는지, 전체 URL인지에 따라 설정이 달라질 수 있습니다.
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080', // 백엔드 주소 (환경변수가 없으면 기본값 사용)
          changeOrigin: true,
          secure: false,
          // 만약 백엔드 API 경로에 '/api'가 포함되지 않는다면 아래 주석을 해제하여 경로를 재작성해야 합니다.
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});