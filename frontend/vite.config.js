import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'pdfjs-dist/build/pdf.worker.mjs': path.resolve(
        __dirname,
        'node_modules/pdfjs-dist/build/pdf.worker.mjs'
      )
    }
  },
  optimizeDeps: {
    include: ['pdfjs-dist']
  }
})