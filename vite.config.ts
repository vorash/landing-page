import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { mailPrivacy } from './tools/privacy-policy';
import { dirIndex } from './tools/dir-index';

export default defineConfig({
  plugins: [react(), dirIndex(), mailPrivacy(path.resolve(__dirname, 'src/mail/privacy-policy.md'))],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        probe: path.resolve(__dirname, 'probe/index.html'),
        mail: path.resolve(__dirname, 'mail/index.html'),
        mailPrivacy: path.resolve(__dirname, 'mail/privacy/index.html'),
        legal: path.resolve(__dirname, 'legal/index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
