import { crop } from '@/algorithm/Media'
import * as tf from '@tensorflow/tfjs'
import cv from '@/algorithm/opencv'
window.cv = cv

export const getArtifactBox = image => {
  let bottomRect = (() => {
    let src = cv.imread(image)
    let contours = new cv.MatVector()
    let hierarchy = new cv.Mat()
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY)
    cv.threshold(src, src, 0, 255, cv.THRESH_TRIANGLE)
    cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    let area = []
    for (let i = 0; i < contours.size(); i++) {
      area.push(cv.contourArea(contours.get(i)))
    }
    let result = cv.boundingRect(contours.get(area.indexOf(Math.max(...area))))
    src.delete(); contours.delete(); hierarchy.delete()
    return result
  })()
  let topRect = (() => {
    let src = cv.imread(image).roi(new cv.Rect(bottomRect.x, 0, bottomRect.width, bottomRect.y))
    let contours = new cv.MatVector()
    let hierarchy = new cv.Mat()
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY)
    cv.threshold(src, src, 100, 255, cv.THRESH_BINARY)
    cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    let result = null
    for (let i = 0; i < contours.size(); i++) {
      let rect = cv.boundingRect(contours.get(i))
      if (rect.width == bottomRect.width) result = rect
    }
    src.delete(); contours.delete(); hierarchy.delete()
    return result
  })()
  return [bottomRect.x, topRect.y, bottomRect.width, bottomRect.y + bottomRect.height - topRect.y]
}

export const getArtifactContentBox = image => {
  let bottomRect = (() => {
    let src = cv.imread(image.toCanvas())
    let contours = new cv.MatVector()
    let hierarchy = new cv.Mat()
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY)
    cv.threshold(src, src, 0, 255, cv.THRESH_TRIANGLE)
    cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    let area = []
    for (let i = 0; i < contours.size(); i++) {
      area.push(cv.contourArea(contours.get(i)))
    }
    let result = cv.boundingRect(contours.get(area.indexOf(Math.max(...area))))
    src.delete(); contours.delete(); hierarchy.delete()
    return result
  })()
  let alternativeRect = (() => {
    let src = cv.imread(image.toCanvas()).roi(new cv.Rect(bottomRect.x, bottomRect.y, bottomRect.width, bottomRect.height))
    let M = cv.Mat.ones(8, 16, cv.CV_8U)
    let low = new cv.Mat(src.rows, src.cols, cv.CV_8UC3, [35, 43, 46, 0])
    let high = new cv.Mat(src.rows, src.cols, cv.CV_8UC3, [77, 255, 255, 0])
    let contours = new cv.MatVector()
    let hierarchy = new cv.Mat()
    cv.erode(src, src, M)
    cv.cvtColor(src, src, cv.COLOR_RGB2HSV)
    cv.inRange(src, low, high, src)
    cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    let area = []
    for (let i = 0; i < contours.size(); i++) {
      area.push(cv.contourArea(contours.get(i)))
    }
    let result = cv.boundingRect(contours.get(area.indexOf(Math.max(...area))))
    src.delete(); M.delete(); low.delete(); high.delete(); contours.delete(); hierarchy.delete()
    return result
  })()
  let bottomRects = (() => {
    let src = cv.imread(image.toCanvas()).roi(new cv.Rect(bottomRect.x, bottomRect.y, bottomRect.width, alternativeRect.y))
    let M = cv.Mat.ones(8, 16, cv.CV_8U)
    let contours = new cv.MatVector()
    let hierarchy = new cv.Mat()
    cv.erode(src, src, M)
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY)
    cv.threshold(src, src, 0, 255, cv.THRESH_OTSU)
    cv.bitwise_not(src, src)
    cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    let rect = []
    for (let i = 0; i < contours.size(); i++) {
      rect.push(cv.boundingRect(contours.get(i)))
    }
    let range = [0, bottomRect.width / 2]
    src.delete(); M.delete(); contours.delete(); hierarchy.delete()
    return rect.filter(i => i.x > range[0] && i.x < range[1]).sort((a, b) => a.y - b.y)
  })()
  let topRects = (() => {
    let src = cv.imread(image.toCanvas()).roi(new cv.Rect(bottomRect.x, 0, bottomRect.width, bottomRect.y))
    let M = cv.Mat.ones(8, 16, cv.CV_8U)
    let contours = new cv.MatVector()
    let hierarchy = new cv.Mat()
    cv.dilate(src, src, M)
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY)
    cv.threshold(src, src, 0, 255, cv.THRESH_OTSU)
    cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    let rect = []
    for (let i = 0; i < contours.size(); i++) {
      rect.push(cv.boundingRect(contours.get(i)))
    }
    let range = [0, bottomRect.width / 2]
    src.delete(); M.delete(); contours.delete(); hierarchy.delete()
    return rect.filter(i => i.x > range[0] && i.x < range[1]).sort((a, b) => a.y - b.y)
  })()
  return {
    part: [topRects[1].x - 3, topRects[1].y - 3, topRects[1].width + 3, topRects[1].height + 3],
    main1: [topRects[2].x - 3, topRects[2].y - 3, topRects[2].width + 3, topRects[2].height + 3],
    main2: [topRects[3].x - 3, topRects[3].y - 3, topRects[3].width + 3, topRects[3].height + 3],
    second: bottomRects.slice(1).map(i => [i.x - 3, bottomRect.y + i.y - 3, i.width + 3, i.height + 3]),
    alternative: [alternativeRect.x - 3, bottomRect.y + alternativeRect.y - 3, alternativeRect.width + 3, alternativeRect.height + 3]
  }
}

class CharacterTable {
  constructor() {
    let chars = '123456789.0%+生之花死羽时沙空杯理冠防御力命值攻击岩元素伤害加成水雷风火冰物充能效率暴治疗精通迷途的勇士平息鸣尊者渡过烈贤人被怜爱少女角斗终幕礼翠绿影流浪大地乐团如盛怒炽炎魔昔日宗室仪染血骑道悠古磐逆飞星沉沦心千牢固苍白追忆注连绝缘旗印'
    this.encode_table = arr => arr.map(str => chars.indexOf(str) + 1)
    this.decode_table = arr => arr.map(index => chars[index - 1] || '')
  }
  removeRepetition(arr) {
    let result = []
    for (let i in arr) {
      if (arr[i] != arr[i - 1]) result.push(arr[i])
    }
    return result
  }
  decode(tensor) {
    return tensor.argMax(2).arraySync().map(this.removeRepetition).map(this.decode_table).map(i => i.join(''))
  }
}

export const preprocess = (inputi, theif) => {
  let src = cv.imread(inputi)
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY)
  cv.blur(src, src, new cv.Size(3, 3))
  let min = Math.min(...src.data)
  src.data.map((c, i) => src.data[i] = src.data[i] - min)
  let max = Math.max(...src.data)
  src.data.map((c, i) => src.data[i] = src.data[i] / max * 255)
  src.data[src.data.length - 1] >= 127.5 && src.data.map((c, i) => src.data[i] = 255 - src.data[i])

  let mask = new cv.Mat()
  cv.threshold(src, mask, 0, 255, cv.THRESH_OTSU)
  mask = tf.tensor2d(mask.data, [mask.rows, mask.cols], 'bool')
  let [c, r] = [mask.any(0), mask.any(1)]
  let x = c.argMax().arraySync()
  if (theif) {
    let a = c.arraySync().slice(x).indexOf(0)
    let b = c.arraySync().slice(x + a).indexOf(1)
    x = x + a + b
  }
  let y = r.argMax().arraySync()
  let width = src.cols - c.reverse().argMax().arraySync() - x
  let height = src.rows - r.reverse().argMax().arraySync() - y
  src = src.roi(new cv.Rect(x, y, width, height))

  cv.resize(src, src, new cv.Size(16 / src.rows * src.cols, 16), 0, 0, cv.INTER_LINEAR)
  cv.copyMakeBorder(src, src, 0, 0, 0, 192 - src.cols, cv.BORDER_CONSTANT)

  return [...src.data].map(i => i / 255)
}

let table = null
let model = null
export const recognition = async input => {
  if (!table) table = new CharacterTable()
  if (!model) model = await tf.loadLayersModel((import.meta.env.DEV ? 'src/' : '') + 'langPath/model.json')
  let output = model.predict(tf.tensor4d(input.flat(), [input.length, 16, 192, 1]))
  return table.decode(output)
}

export const readArtifact = async image => {
  const readAttribute = str => ({
    name: (str.split('+')[0] || '').replace(/[^攻击力生命值防御元素充能效率暴伤害精通]/g, ''),
    value: (str.split('+')[1] || '').replace(/[^123456789.0%]/g, '')
  })
  const box = getArtifactContentBox(image)

  let part = preprocess(crop(image.toCanvas(), ...box.part))
  let main1 = preprocess(crop(image.toCanvas(), ...box.main1))
  let main2 = preprocess(crop(image.toCanvas(), ...box.main2))
  let second1 = preprocess(crop(image.toCanvas(), ...box.second[0]), true)
  let second2 = preprocess(crop(image.toCanvas(), ...box.second[1]), true)
  let second3 = preprocess(crop(image.toCanvas(), ...box.second[2]), true)
  let second4 = preprocess(crop(image.toCanvas(), ...box.second[3]), true)
  let alternative = preprocess(crop(image.toCanvas(), ...box.alternative))

  let str = await recognition([part, main1, main2, second1, second2, second3, second4, alternative]);

  [part, main1, main2, second1, second2, second3, second4, alternative] = str

  const Artifact = {
    part: part.replace(/[^生之花死羽时沙空杯理冠]/g, ''),
    main: { name: main1.replace(/[^防御力生命值攻击岩元素伤害加成水雷风火冰物理充能效率暴治疗精通]/g, ''), value: main2.replace(/[^123456789.0%]/g, '') },
    second1: readAttribute(second1),
    second2: readAttribute(second2),
    second3: readAttribute(second3),
    second4: readAttribute(second4),
    alternative: alternative.replace(/[^冰风迷途的勇士平息鸣雷尊者渡过烈火贤人被怜爱少女角斗终幕礼翠绿之影流浪大地乐团如盛怒炽炎魔昔日宗室仪染血骑道悠古磐岩逆飞星沉沦心千牢固苍白追忆注连绝缘旗印]/g, '')
  }
  return Artifact
}