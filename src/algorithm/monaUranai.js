import { div } from '@/algorithm/MathSystem';

const toSetName = (alternative) => {
  return alternative
    .replace('冰风迷途的勇士', 'blizzardStrayer')
    .replace('平息雷鸣的尊者', 'thunderSmoother')
    .replace('渡过烈火的贤人', 'lavaWalker')
    .replace('被怜爱的少女', 'maidenBeloved')
    .replace('角斗士的终幕礼', 'gladiatorFinale')
    .replace('翠绿之影', 'viridescentVenerer')
    .replace('流浪大地的乐团', 'wandererTroupe')
    .replace('如雷的盛怒', 'thunderingFury')
    .replace('炽烈的炎之魔女', 'crimsonWitch')
    .replace('昔日宗室之仪', 'noblesseOblige')
    .replace('染血的骑士道', 'bloodstainedChivalry')
    .replace('悠古的磐岩', 'archaicPetra')
    .replace('逆飞的流星', 'retracingBolide')
    .replace('沉沦之心', 'heartOfDepth')
    .replace('千岩牢固', "tenacityOfTheMillelith")
    .replace('苍白之火', "paleFlame")
}

const toPosition = (part) => {
  return part
    .replace('生之花', "flower")
    .replace('死之羽', "feather")
    .replace('时之沙', "sand")
    .replace('空之杯', "cup")
    .replace('理之冠', "head")
}

function toTag(input) {
  let name;
  let value;
  if (input.value.includes('%')) {
    name = input.name
      .replace('攻击力', "attackPercentage")
      .replace('防御力', "defendPercentage")
      .replace('生命值', "lifePercentage")
      .replace('暴击率', "critical")
      .replace('暴击伤害', "criticalDamage")
      .replace('元素充能效率', "recharge")
      .replace('治疗加成', "cureEffect")
      .replace('物理伤害加成', "physicalBonus")
      .replace('火元素伤害加成', "fireBonus")
      .replace('雷元素伤害加成', "thunderBonus")
      .replace('冰元素伤害加成', "iceBonus")
      .replace('水元素伤害加成', "waterBonus")
      .replace('风元素伤害加成', "windBonus")
      .replace('岩元素伤害加成', "rockBonus")
    value = div(input.value.replace('%', ''), 100)
  } else {
    name = input.name
      .replace('攻击力', "attackStatic")
      .replace('防御力', "defendStatic")
      .replace('生命值', "lifeStatic")
      .replace('元素精通', "elementalMastery")
    value = Number(input.value)
  }
  return { name, value };
}

const monaUranai = json => {
  let result = {
    flower: [],
    feather: [],
    sand: [],
    cup: [],
    head: []
  }
  let id = 0;
  json.forEach(element => {
    let artifact = {
      setName: toSetName(element.alternative),
      position: toPosition(element.part),
      //detailName: null,
      mainTag: toTag(element.main),
      normalTags: [
        toTag(element.second1),
        toTag(element.second2),
        toTag(element.second3),
        toTag(element.second4)
      ],
      omit: false,
      star: 5,
      level: 20,
      id: id++
    }
    result[artifact.position].push(artifact);
  })
  return result;
}

export default monaUranai