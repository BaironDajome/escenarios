import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true, // ← permite cualquier host
    host: true,          // ← necesario para accesos externos (ngrok, Cloudflare, etc)
  },
});
