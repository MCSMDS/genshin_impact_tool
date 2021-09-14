import ffmpeg from 'ffmpeg.js/ffmpeg-mp4.js'

export const MediaFile = class {
  #file
  constructor(file) {
    this.#file = file
  }
  toFile() {
    switch (this.#file.constructor.name) {
      case 'File':
        return new File([this.#file], '')
      case 'HTMLCanvasElement':
        return new File([new Uint8Array(atob(this.#file.toDataURL().split(',')[1]).split('').map(i => i.charCodeAt()))], '')
    }
  }
  toURL() {
    switch (this.#file.constructor.name) {
      case 'File':
        return URL.createObjectURL(this.#file)
      case 'HTMLCanvasElement':
        return this.#file.toDataURL()
    }
  }
  toBuffer() {
    switch (this.#file.constructor.name) {
      case 'ArrayBuffer':
        return this.#file.slice()
      case 'File':
        return new Promise(resolve => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsArrayBuffer(this.#file)
        })
    }
  }
  toCanvas() {
    switch (this.#file.constructor.name) {
      case 'File':
        return new Promise(resolve => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            canvas.getContext('2d').drawImage(img, 0, 0)
            resolve(canvas)
          }
          img.src = URL.createObjectURL(this.#file)
        })
      case 'HTMLCanvasElement':
        return (() => {
          const canvas = document.createElement('canvas')
          canvas.width = this.#file.width
          canvas.height = this.#file.height
          canvas.getContext('2d').drawImage(this.#file, 0, 0)
          return canvas
        })()
    }
  }
}

export const video2audio = async media => {
  let data = await media.toBuffer()
  let result = ffmpeg({
    MEMFS: [{ name: 'input.mp4', data }],
    arguments: ['-i', 'input.mp4', 'output.mp3']
  })
  return new MediaFile(result.MEMFS[0].data.buffer)
}
