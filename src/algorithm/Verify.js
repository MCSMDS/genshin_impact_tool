import { sum, plus, minus } from '@/algorithm/MathSystem';

const list = [
  [4.1, 4.7, 5.3, 5.8],
  [4.1, 4.7, 5.3, 5.8],
  [5.1, 5.8, 6.6, 7.3],
  [4.5, 5.2, 5.8, 6.5],
  [2.7, 3.1, 3.5, 3.9],
  [5.4, 6.2, 7.0, 7.8],
  [14, 16, 18, 19],
  [209, 239, 269, 299],
  [16, 19, 21, 23],
  [16, 19, 21, 23]
];

function listBuilder(input) {
  let output = [];
  for (let i of input) for (let ii of input) for (let iii of input) for (let iiii of input) for (let iiiii of input) for (let iiiiii of input) {
    output.push(sum(i));
    output.push(sum(i, ii));
    output.push(sum(i, ii, iii));
    output.push(sum(i, ii, iii, iiii));
    output.push(sum(i, ii, iii, iiii, iiiii));
    output.push(sum(i, ii, iii, iiii, iiiii, iiiiii));
  }
  return output;
};

const verifyPart = part => {
  return ['生之花', '死之羽', '时之沙', '空之杯', '理之冠'].includes(part);
}

const verifyMain = (main) => {
  var abcd;
  if (main.value.includes('%')) {
    var a = {
      防御力: 58.3,
      生命值: 46.6,
      攻击力: 46.6,
      岩元素伤害加成: 46.6,
      水元素伤害加成: 46.6,
      雷元素伤害加成: 46.6,
      风元素伤害加成: 46.6,
      火元素伤害加成: 46.6,
      冰元素伤害加成: 46.6,
      物理伤害加成: 58.3,
      元素充能效率: 51.8,
      暴击率: 31.1,
      暴击伤害: 62.2,
      治疗加成: 35.9,
    }
    abcd = a[main.name]
  } else {
    var a = {
      生命值: 4780,
      攻击力: 311,
      元素精通: 187
    }
    abcd = a[main.name]
  }
  return abcd == main.value.replace('%', '');
}

const verifySecond = (second) => {
  const cr = i => list[i].length == 4 ? list[i] = listBuilder(list[i]) : list[i];
  const f = (arr, n) => arr.includes(n);
  if (second.value.includes('%')) {
    var a = {
      攻击力: 0,
      生命值: 1,
      防御力: 2,
      元素充能效率: 3,
      暴击率: 4,
      暴击伤害: 5
    };
    if (a[second.name] == undefined) return false;
    var abcd = cr(a[second.name])
    var n = Number(second.value.replace('%', ''));
    return !isNaN(n) && (f(abcd, n) || f(abcd, plus(n, 0.1)) || f(abcd, minus(n, 0.1)))
  } else {
    var a = {
      攻击力: 6,
      生命值: 7,
      防御力: 8,
      元素精通: 9
    };
    if (a[second.name] == undefined) return false;
    var abcd = cr(a[second.name])
    var n = Number(second.value.replace('%', ''));
    return !isNaN(n) && (f(abcd, n) || f(abcd, plus(n, 1)) || f(abcd, minus(n, 1)))
  }
};

const verifyAlternative = alternative => {
  const alter = [
    '冰风迷途的勇士',
    '平息鸣雷的尊者',
    '渡过烈火的贤人',
    '被怜爱的少女',
    '角斗士的终幕礼',
    '翠绿之影',
    '流浪大地的乐团',
    '如雷的盛怒',
    '炽烈的炎之魔女',
    '昔日宗室之仪',
    '染血的骑士道',
    '悠古的磐岩',
    '逆飞的流星',
    '沉沦之心',
    '千岩牢固',
    '苍白之火'
  ];
  return alter.includes(alternative);
}

const Verify = element => {
  return [
    verifyPart(element.part),
    verifyMain(element.main),
    verifySecond(element.second1),
    verifySecond(element.second2),
    verifySecond(element.second3),
    verifySecond(element.second4),
    verifyAlternative(element.alternative),
  ];
};

export default Verify;