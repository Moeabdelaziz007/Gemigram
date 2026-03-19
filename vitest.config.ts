import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['__tests__/**/*.test.ts', 'hooks/__tests__/**/*.test.tsx', 'components/__tests__/**/*.test.tsx'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
