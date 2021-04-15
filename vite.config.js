import path from 'path'
import fs from 'fs-extra'
import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'

const ffmpeg = () => {
  let mode
  return {
    configResolved(resolvedConfig) {
      mode = resolvedConfig.command
    },
    resolveId(id) {
      if (id === 'opencvPath') {
        return 'opencvPath'
      }
    },
    load(id) {
      if (id === 'opencvPath') {
        return `export default '${mode === 'build' ? 'assets/opencv.js' : 'src/opencv.js'}'`
      }
    },
    closeBundle() {
      if (mode === 'build') {
        fs.copySync('src/langPath', 'dist/langPath')
        //fs.copySync('src/opencv.js', 'dist/assets/opencv.js')
      }
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
    ffmpeg()
  ]
})