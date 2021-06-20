class FileSystem {
  constructor(file) {
    this.file = file;
  }
  toBuffer() {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result);
      reader.readAsArrayBuffer(this.file);
    });
  }
  toURL() {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(this.file);
    });
  }
  toCanvas() {
    return new Promise(async (resolve) => {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        canvas.getContext('2d').drawImage(img, 0, 0)
        resolve(canvas);
      }
      img.src = await this.toURL()
    });
  }
}

export default FileSystem;