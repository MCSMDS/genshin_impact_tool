import cv from '@/algorithm/opencv'

export const getArtifactBox = image => {
  const src = cv.imread(image)
  cv.cvtColor(src, src, cv.COLOR_RGB2GRAY)
  cv.Canny(src, src, 8, 128, 3, true)
  cv.dilate(src, src, new cv.Mat())
  const contours = new cv.MatVector()
  cv.findContours(src, contours, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
  const area = []
  for (let i = 0; i < contours.size(); i++) { area.push(cv.contourArea(contours.get(i))) }
  const { x, y, width, height } = cv.boundingRect(contours.get(area.indexOf(Math.max(...area))))
  return [x + 5, y + 5, width - 5, height - 5]
}

export const getArtifactContentBox = image => {
  const src = cv.imread(image.toCanvas())
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
  return area.reverse().slice(0, 11)
}