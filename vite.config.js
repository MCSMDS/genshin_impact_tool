import path from 'path'
import fs from 'fs-extra'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const langPath = () => {
  let mode
  return {
    configResolved({ command }) {
      mode = command
    },
    closeBundle() {
      mode === 'build' && fs.copySync('src/langPath', 'dist/langPath')
    }
  }
}

export default defineConfig({
  base: './',
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.svelte'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  plugins: [
    svelte(),
    langPath()
  ]
})