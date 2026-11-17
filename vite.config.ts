import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/year2-anniversary/',
  plugins: [react()],
});
