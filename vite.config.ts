import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), {
      name: 'local-only-development-leads',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url?.startsWith('/api/leads')) return next();
          const host = (req.headers.host || '').split(':')[0].toLowerCase();
          const forwarded = (req.headers['x-forwarded-host'] || '').toString().split(',')[0].trim().split(':')[0].toLowerCase();
          if (!['localhost', '127.0.0.1'].includes(host) || (forwarded && !['localhost', '127.0.0.1'].includes(forwarded))) {
            res.statusCode = 503;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: { code: 'lead_destination_unavailable', message: 'Lead submissions are unavailable on the public preview.' } }));
            return;
          }
          next();
        });
      },
    }],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {'/api': process.env.API_TARGET || 'http://127.0.0.1:3001'},
      allowedHosts: ['.vorflux.com'],
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
