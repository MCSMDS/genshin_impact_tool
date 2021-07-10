import { createWorker, createScheduler } from 'tesseract.js'
import { buildPercentage } from '@/algorithm/MathSystem';
import cv from '@/algorithm/opencv';

window.cv=cv;
const getBox = async image => {
  const src = cv.imread(await image.toCanvas());
  cv.cvtColor(src, src, cv.COLOR_RGB2GRAY);
  cv.Canny(src, src, 8, 128, 3, true);
  cv.dilate(src, src, cv.Mat.ones(8, 32, cv.CV_8U))
  const contours = new cv.MatVector();
  cv.findContours(src, contours, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  let area = [];
  for (let i = 0; i < contours.size(); i++) {
    const cnt = contours.get(i);
    const rect = cv.boundingRect(cnt)
    const aspectRatio = rect.width / rect.height;
    if (aspectRatio > 1.5 && aspectRatio < 16) {
      area.push([rect.x, rect.y, rect.width, rect.height])
    }
  }
  return area.reverse().slice(0, 11);
}

class OCR {
  //static Chinese = 'chi_sim';
  //static Number = 'chi_sim+eng';
  constructor(language) {
    this._init = (async () => {
      this.scheduler = createScheduler();
      this.worker = createWorker({ langPath: (import.meta.env.DEV ? 'src/' : '') + 'langPath' });
      await this.worker.load();
      await this.worker.loadLanguage(language);
      await this.worker.initialize(language);
      this.scheduler.addWorker(this.worker);
    })();
  };
  init() {
    return this._init;
  }
  async read(image, left, top, width, height) {
    return this.scheduler.addJob('recognize', image, { rectangle: { left, top, width, height } }).then(result => result.data.text);
  };
  close() {
    this.scheduler.terminate();
  };
};

const chineseOCR = new OCR('chi_sim');
const numberhOCR = new OCR('chi_sim+eng');

const toNegate = async negateimg => {
  const canvas = await negateimg.toCanvas()
  const ctx = canvas.getContext('2d')
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < data.data.length; i += 4) {
    data.data[i] = 255 - data.data[i];
    data.data[i + 1] = 255 - data.data[i + 1];
    data.data[i + 2] = 255 - data.data[i + 2];
  }
  ctx.putImageData(data, 0, 0)
  return canvas
}

const readArtifact = async (image, progress) => {
  await chineseOCR.init();
  await numberhOCR.init();

  const readAttribute = str => ({
    name: (str.split('+')[0] || '').replace(/[^攻击力生命值防御元素充能效率暴伤害精通]/g, ''),
    value: (str.split('+')[1] || '').replace(/[^123456789.0%]/g, '')
  });
  const newProgress = buildPercentage(9, progress);

  const box = await getBox(image);
  console.log(box)
  let negateimg = await toNegate(image);
  newProgress();
  let part = (box[1] && (await chineseOCR.read(negateimg, ...box[1]))) || '';
  newProgress();
  let main1 = (box[2] && (await chineseOCR.read(negateimg, ...box[2]))) || '';
  newProgress();
  let main2 = (box[3] && (await numberhOCR.read(negateimg, ...box[3]))) || '';
  newProgress();
  let second1 = (box[6] && (await chineseOCR.read(image.toFile(), ...box[6]))) || '';
  newProgress()
  let second2 = (box[7] && (await chineseOCR.read(image.toFile(), ...box[7]))) || '';
  newProgress();
  let second3 = (box[8] && (await chineseOCR.read(image.toFile(), ...box[8]))) || '';
  newProgress();
  let second4 = (box[9] && (await chineseOCR.read(image.toFile(), ...box[9]))) || '';
  newProgress();
  let alternative = (box[10] && (await chineseOCR.read(image.toFile(), ...box[10]))) || '';
  newProgress();

  const Artifact = {
    part: part.replace(/[^生之花死羽时沙空杯理冠]/g, ''),
    main: { name: main1.replace(/[^防御力生命值攻击岩元素伤害加成水雷风火冰物理充能效率暴治疗精通]/g, ''), value: main2.replace(/[^123456789.0%]/g, '') },
    second1: readAttribute(second1),
    second2: readAttribute(second2),
    second3: readAttribute(second3),
    second4: readAttribute(second4),
    alternative: alternative.replace(/[^冰风迷途的勇士平息鸣雷尊者渡过烈火贤人被怜爱少女角斗终幕礼翠绿之影流浪大地乐团如盛怒炽炎魔昔日宗室仪染血骑道悠古磐岩逆飞星沉沦心千牢固苍白]/g, '')
  };
  return Artifact;
};

export default readArtifact