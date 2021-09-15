import path from 'path'
import fs from 'fs-extra'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const plugins = () => {
  let mode
  return {
    configResolved({ command }) {
      mode = command
    },
    closeBundle() {
      if (mode === 'build') {
        fs.copySync('src/langPath', 'dist/langPath')
        fs.copySync('src/db/icon', 'dist/db')
      }
    }
  }
}

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.svelte']
  },
  plugins: [
    svelte(),
    plugins()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (path.extname(id) === '.js') {
            if (id.includes('ffmpeg')) return 'ffmpeg'
            if (id.includes('opencv')) return 'opencv'
            if (id.includes('algorithm')) return 'algorithm'
            if (id.includes('node_modules')) return 'vendor'
          }
          if (path.extname(id) === '.json') {
            return 'json'
          }
        }
      }
    }
  }
})