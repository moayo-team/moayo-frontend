// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],

    // ✅ SockJS에서 요구하는 global을 브라우저에서 제공
    define: {
      global: 'globalThis',
    },

    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
