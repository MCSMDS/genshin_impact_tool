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

export const getTimeDomainData = async (media, sampleRate) => {
  const ac = new (window.AudioContext || window.webkitAudioContext)()
  const buffer = await media.toBuffer()
  const data = await new Promise(resolve => ac.decodeAudioData(buffer, resolve))
  const normalization = arr => {
    let max = 0
    for (let i in arr) {
      arr[i] = Math.abs(arr[i])
      max = Math.max(arr[i], max)
    }
    for (let i in arr) arr[i] /= max
    return arr
  }
  const compression = (arr, size) => {
    const result = []
    for (let i = 0; i < arr.length / size; i++) {
      let value = 0
      const from = i * size
      const to = Math.min(from + size, arr.length)
      for (let j = from; j < to; j++) value = Math.max(arr[j], value)
      result.push(value)
    }
    return result
  }
  return compression(normalization(data.getChannelData(0)), data.sampleRate / sampleRate)
  let canvas = document.createElement('canvas')
  canvas.width = arr.length
  canvas.height = 600
  let ctx = canvas.getContext('2d')
  ctx.moveTo(0, 600)
  for (let i in arr) {
    ctx.lineTo(i, 600 - arr[i] * 600)
  }
  ctx.lineTo(arr.length, 600)
  ctx.stroke()
  canvas.toBlob(i => console.log(URL.createObjectURL(i)))
}

export const getLoudTimes = (data, sampleRate) => {
  let result = []
  let buffer = []
  for (let i = 0; i < data.length; i++) {
    if (data[i] >= 0.5) {
      buffer.push(i)
    } else if (buffer[0]) {
      result.push(~~(buffer.reduce((a, b) => a + b) / buffer.length) / sampleRate)
      buffer = []
    }
  }
  return result
}

export const video2images = (media, times) => new Promise(resolve => {
  let index = 0
  const images = []
  const video = document.createElement('video')
  video.addEventListener('loadeddata', () => video.currentTime = times[index])
  video.addEventListener('seeked', async () => {
    if (index < times.length) {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      await new Promise(resolve => setTimeout(resolve, 512))
      canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
      images.push(canvas)
      video.currentTime = times[index = index + 1] || 0
    } else {
      resolve(images)
    }
  })
  video.playsInline = true
  video.src = media.toURL()
  video.play()
  video.pause()
})

export const crop = (image, x, y, width, height) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(image, x, y, width, height, 0, 0, width, height)
  return canvas
}