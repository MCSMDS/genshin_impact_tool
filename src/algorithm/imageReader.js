import { plus, buildPercentage } from '@/systen/MathSystem';
import FileSystem from "@/systen/FileSystem";
import cv from "@/algorithm/opencv";

const getLoudestTimes = async (file, amount) => {
  if (window.AudioContext) {
    const pcm = await new AudioContext().decodeAudioData(await file.toBuffer());
    const data = pcm.getChannelData(0);
    const split = pcm.sampleRate / 10;
    const compress = [];
    for (let i = 0; i < data.length / split; i++) {
      let value = 0;
      const from = i * split;
      const to = Math.min(from + split, data.length);
      for (let j = from; j < to; j++) value = Math.max(data[j], value);
      compress.push(value);
    }
    var loudest = [...compress].sort((x, y) => y - x)[amount];
    return compress.map((value, index) => value <= loudest ? NaN : index / 10).filter(value => !isNaN(value));
  } else {
    return new Promise(async resolve => {
      const audio = document.createElement("audio");
      audio.ondurationchange = () => resolve([...Array(Math.ceil(audio.duration * 10))].map((value, index) => index / 10));
      audio.src = await file.toURL()
    })
  }
}

const captureImgs = (file, times, updatePercentage) => new Promise(async resolve => {
  let index = 0;
  const images = [];
  const video = document.createElement("video");
  video.addEventListener('loadeddata', () => video.currentTime = times[index]);
  video.addEventListener('seeked', async () => {
    if (index < times.length) {
      let canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      await new Promise(resolve => setTimeout(resolve, 512));
      canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      images.push(canvas);
      updatePercentage()
      video.currentTime = times[index = index + 1] || 0;
    } else {
      resolve(images);
    }
  });
  video.playsInline = true;
  video.src = await file.toURL();
  video.play();
  video.pause();
  updatePercentage();
})

const getBox = async (image) => {
  const src = cv.imread(image);
  cv.cvtColor(src, src, cv.COLOR_RGB2GRAY);
  cv.Canny(src, src, 8, 128, 3, true);
  cv.dilate(src, src, new cv.Mat());
  const contours = new cv.MatVector();
  cv.findContours(src, contours, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  const area = [];
  for (let i = 0; i < contours.size(); i++) { area.push(cv.contourArea(contours.get(i))) }
  const { x, y, width, height } = cv.boundingRect(contours.get(area.indexOf(Math.max(...area))));
  return [x + 2, y + 2, width - 2, height - 2];
}

const crop = (image, x, y, width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(image, x, y, width, height, 0, 0, width, height);
  return canvas;
}

const imageReader = async (file, amount = 1, progress = () => null) => {
  const [loudestTime] = await getLoudestTimes(file, 1);
  const loudestTimes = await getLoudestTimes(file, amount || 1);
  const newProgress = buildPercentage(plus(5, loudestTimes.length), progress);
  newProgress();
  let images = await captureImgs(file, loudestTimes, newProgress);
  newProgress();
  const [x, y, width, height] = await getBox(images[loudestTimes.indexOf(loudestTime)]);
  newProgress();
  images = await Promise.all(images.map(canvas => new Promise(resolve => crop(canvas, x, y, width, height).toBlob(resolve))));
  newProgress();
  return images.map((blob, id) => new FileSystem(new File([blob], id + '.png')));
}

export default imageReader;