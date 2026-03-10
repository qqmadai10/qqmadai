import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    plugins: [react()],
    base: '/qqmadai/',  // 重要！必须和仓库名一致
    build: {
      outDir: 'dist',
      rollupOptions: {
        external: ['fsevents', 'node:path', 'node:process', 'node:perf_hooks', 'node:fs/promises']
      }
    },
    define: {
      'process.env': {}, 
    },
  };
});