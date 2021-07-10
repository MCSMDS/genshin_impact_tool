class FileSystem {
  #file
  constructor(file) {
    switch (file.constructor.name) {
      case 'File': this.#file = file; break;
      case 'Blob': this.#file = new File([file], ''); break;
      case 'HTMLCanvasElement': this.#file = new File([Uint8Array.from(atob(file.toDataURL().split(',')[1]).split('').map(i => i.charCodeAt()))], ''); break;
    }
  }
  toFile() {
    return this.#file
  }
  toURL() {
    return URL.createObjectURL(this.#file)
  }
  toBuffer() {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result);
      reader.readAsArrayBuffer(this.#file);
    });
  }
  toCanvas() {
    return new Promise(async resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        canvas.getContext('2d').drawImage(img, 0, 0)
        resolve(canvas);
      }
      img.src = this.toURL()
    });
  }
}

export default FileSystem;