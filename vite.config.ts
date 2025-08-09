import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy, options) => {
          // Fallback to local handler if no backend server
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error, using local handler');
            import('./src/api/plan.ts').then(module => {
              module.default(req as any).then(response => {
                response.body?.pipeTo(res as any);
              });
            });
          });
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
