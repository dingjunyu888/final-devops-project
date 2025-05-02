import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',        // needed inside Docker/K8s
    port: 5173,
    allowedHosts: ['.elb.amazonaws.com'], // allow any ELB domain
  },
});
