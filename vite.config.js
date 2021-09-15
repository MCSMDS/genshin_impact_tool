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
            if (id.includes('algorithm/Artifact')) return 'Artifact'
            if (id.includes('algorithm/Damage')) return 'Damage'
            if (id.includes('algorithm/MathSystem')) return 'MathSystem'
            if (id.includes('algorithm/Media')) return 'Media'
            if (id.includes('algorithm/monaUranai')) return 'monaUranai'
            if (id.includes('algorithm/opencv')) return 'opencv'
            if (id.includes('algorithm/StoreSystem')) return 'StoreSystem'
            if (id.includes('algorithm/Verify')) return 'Verify'
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