import { crop } from '@/algorithm/Media'
import { getArtifactContentBox } from '@/algorithm/Artifact'
import * as tf from '@tensorflow/tfjs'
import cv from '@/algorithm/opencv'
//(import.meta.env.DEV ? 'src/' : '') + 'langPath'
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

export const preprocess = async (inputi, theif) => {
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

  cv.resize(src, src, new cv.Size(32 / src.rows * src.cols, 32), 0, 0, cv.INTER_LINEAR)
  cv.copyMakeBorder(src, src, 0, 0, 0, 384 - src.cols, cv.BORDER_CONSTANT)

  //cv.imshow('output', src)

  let table = new CharacterTable()
  let model = await tf.loadLayersModel((import.meta.env.DEV ? 'src/' : '') + 'langPath/model.json')

  let input = [...src.data].map(i => i / 255)
  let output = model.predict(tf.tensor4d(input, [1, 32, 384, 1]))

  return table.decode(output)[0]
}

const readArtifact = async image => {

  const readAttribute = str => ({
    name: (str.split('+')[0] || '').replace(/[^攻击力生命值防御元素充能效率暴伤害精通]/g, ''),
    value: (str.split('+')[1] || '').replace(/[^123456789.0%]/g, '')
  })

  const box = getArtifactContentBox(image)

  let part = await preprocess(crop(image.toCanvas(), ...box[1]))
  let main1 = await preprocess(crop(image.toCanvas(), ...box[2]))
  let main2 = await preprocess(crop(image.toCanvas(), ...box[3]))
  let second1 = await preprocess(crop(image.toCanvas(), ...box[6]), true)
  let second2 = await preprocess(crop(image.toCanvas(), ...box[7]), true)
  let second3 = await preprocess(crop(image.toCanvas(), ...box[8]), true)
  let second4 = await preprocess(crop(image.toCanvas(), ...box[9]), true)
  let alternative = await preprocess(crop(image.toCanvas(), ...box[10]))

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

export default readArtifact