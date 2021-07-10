<script>
  import { artifact } from '@/algorithm/StoreSystem'
  import { crop } from '@/algorithm/mediaUtility'
  import FileSystem from '@/algorithm/FileSystem'
  import cv from '@/algorithm/opencv'

  const {
    setting: { thenum, x, y, width, height, cut },
  } = artifact

  const colorText = (image) => {
    const src = cv.imread(image)
    const dst = cv.imread(image)
    const canvas = document.createElement('canvas')
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY)
    cv.Canny(src, src, 8, 128, 3, true)
    cv.dilate(src, src, cv.Mat.ones(8, 32, cv.CV_8U))
    const contours = new cv.MatVector()
    cv.findContours(src, contours, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    let area = []
    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i)
      const rect = cv.boundingRect(cnt)
      const aspectRatio = rect.width / rect.height
      if (aspectRatio > 1.5 && aspectRatio < 16) {
        area.push([rect.x, rect.y, rect.width, rect.height])
      }
    }
    area = area.reverse().slice(0, 11)
    area.map(([x, y, width, height]) => cv.rectangle(dst, new cv.Point(x, y), new cv.Point(x + width, y + height), new cv.Scalar(0, 0, 0, 255), 3))
    cv.imshow(canvas, dst)
    return canvas
  }
</script>

<div class="flex rounded-md shadow mb-1">
  <span class="px-2 py-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">圣遗物读取量</span>
  <input
    type="number"
    placeholder="1"
    bind:value={$thenum}
    class="px-2 py-1 flex-1 appearance-none rounded-none rounded-r-md border outline-none border-gray-300 ring-inset ring-indigo-500 focus:ring-1 focus:border-indigo-500"
  />
</div>

<div class="flex rounded-md shadow mb-1">
  <span class="px-2 py-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">X</span>
  <input
    type="number"
    placeholder="1"
    bind:value={$x}
    class="px-2 py-1 flex-1 appearance-none rounded-none rounded-r-md border outline-none border-gray-300 ring-inset ring-indigo-500 focus:ring-1 focus:border-indigo-500"
  />
</div>

<div class="flex rounded-md shadow mb-1">
  <span class="px-2 py-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">Y</span>
  <input
    type="number"
    placeholder="1"
    bind:value={$y}
    class="px-2 py-1 flex-1 appearance-none rounded-none rounded-r-md border outline-none border-gray-300 ring-inset ring-indigo-500 focus:ring-1 focus:border-indigo-500"
  />
</div>

<div class="flex rounded-md shadow mb-1">
  <span class="px-2 py-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">Width</span>
  <input
    type="number"
    placeholder="1"
    bind:value={$width}
    class="px-2 py-1 flex-1 appearance-none rounded-none rounded-r-md border outline-none border-gray-300 ring-inset ring-indigo-500 focus:ring-1 focus:border-indigo-500"
  />
</div>

<div class="flex rounded-md shadow mb-1">
  <span class="px-2 py-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">Height</span>
  <input
    type="number"
    placeholder="1"
    bind:value={$height}
    class="px-2 py-1 flex-1 appearance-none rounded-none rounded-r-md border outline-none border-gray-300 ring-inset ring-indigo-500 focus:ring-1 focus:border-indigo-500"
  />
</div>

<img src={new FileSystem(colorText(crop($cut, $x, $y, $width, $height))).toURL()} alt="" />
