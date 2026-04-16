/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({  }) => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(),tailwindcss()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        target: 'esnext',
        minify: 'esbuild',
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          maxParallelFileOps: 3,
          output: {
            manualChunks: {
              'vendor-amplify': ['aws-amplify'],
              'vendor-utils': ['xlsx', 'docx', 'file-saver', 'qrcode'],
              'vendor-ui': ['lucide-react', 'react', 'react-dom', 'react-router-dom', 'sonner'],
              'vendor-editor': ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-image', '@tiptap/extension-link', '@tiptap/extension-underline'],
            }
          }
        }
      },
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
      }
    };
});
