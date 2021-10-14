import fs from 'fs-extra'
import { readJsonData, readTextMap } from './utility.mjs'

const cartesian = (arr, n) => Array(n).fill(arr).reduce((a, b) => a.flatMap(a => b.map(b => [a, b].flat())), [[]])
const jsondata = readJsonData({
  ReliquaryLevelExcelConfigData: {},//圣遗物主词条
  ReliquaryAffixExcelConfigData: {},//圣遗物副词条
  ReliquarySetExcelConfigData: {},//圣遗物图鉴
  EquipAffixExcelConfigData: {}//圣遗物套装
})

const part2mainkey = {
  '生之花': ['生命值'],
  '死之羽': ['攻击力'],
  '时之沙': ['生命值%', '攻击力%', '防御力%', '元素充能效率', '元素精通'],
  '空之杯': ['生命值%', '攻击力%', '防御力%', '元素精通', '火元素伤害加成', '雷元素伤害加成', '水元素伤害加成', '风元素伤害加成', '岩元素伤害加成', '冰元素伤害加成', '物理伤害加成'],
  '理之冠': ['生命值%', '攻击力%', '防御力%', '暴击率', '暴击伤害', '治疗加成', '元素精通']
}

const mainkey2mainvalue = () => {
  let obj = {}
  jsondata.ReliquaryLevelExcelConfigData.filter(i => {
    switch (i.Rank) {
      case 1: return i.Level <= 4 + 1
      case 2: return i.Level <= 4 + 1
      case 3: return i.Level <= 12 + 1
      case 4: return i.Level <= 16 + 1
      case 5: return i.Level <= 20 + 1
    }
  }).forEach(i => i.AddProps.filter(i => {
    return i.PropType != 'FIGHT_PROP_DEFENSE' && i.PropType != 'FIGHT_PROP_GRASS_ADD_HURT' && i.PropType != 'FIGHT_PROP_FIRE_SUB_HURT'
  }).forEach(i => {
    let key = i.PropType.includes('_PERCENT') ? readTextMap(i.PropType) + '%' : readTextMap(i.PropType)
    let value = i.Value < 1 ? (i.Value * 100).toFixed(1) + '%' : i.Value.toFixed(0)
    !obj[key] && (obj[key] = [])
    obj[key].push(value)
  }))
  return obj
}

const secondkey2secondvalue = () => {
  let obj = {}
  jsondata.ReliquaryAffixExcelConfigData.filter(i =>
    i.DepotId === 101 || i.DepotId === 201 || i.DepotId === 301 || i.DepotId === 401 || i.DepotId === 501
  ).map(i => {
    let key = i.PropType.includes('_PERCENT') ? readTextMap(i.PropType) + '%' : readTextMap(i.PropType)
    !obj[key] && (obj[key] = [])
    obj[key].push(i.PropValue)
  })
  let obj2 = {}
  for (const key of Object.keys(obj)) {
    !obj2[key] && (obj2[key] = []);
    [[0, 2, 1], [2, 5, 1], [5, 9, 2], [9, 13, 4], [13, 17, 6]].forEach(i => {//2,3,11,31,51
      let arr = obj[key].slice(i[0], i[1])
      let arr2
      if (arr.length === 2) arr2 = [80, 100]
      if (arr.length === 3) arr2 = [70, 85, 100]
      if (arr.length === 4) arr2 = [70, 80, 90, 100]

      let result = []
      for (let i2 = 1; i2 <= i[2]; i2++) {
        result.push(cartesian(arr2, i2))
      }
      let tojson = result.flat().map(i => [i.map(i => arr2.indexOf(i)), i.reduce((a, b) => a + b)]).sort((a, b) => a[1] - b[1])
      let remove = [tojson[0]]
      for (let i = 1; i < tojson.length; i++) {
        if (tojson[i][1] != tojson[i - 1][1]) remove.push(tojson[i])
      }
      result = remove.map(i => i[0].map(i => arr[i]))
      result = result.map(i => {
        let value = i.reduce((a, b) => a + b)
        value = value < 1 ? (value * 100).toFixed(1) + '%' : value.toFixed(0)
        return value
      })
      obj2[key].push(result)
    })
    obj2[key] = obj2[key].flat()
  }
  return obj2
}

const alternative = () => {
  let obj = []
  for (let data of jsondata.ReliquarySetExcelConfigData.filter(json => !json.DisableFilter)) {
    let affix = jsondata.EquipAffixExcelConfigData.filter(json => json.Id == data.EquipAffixId)
    let affixName = readTextMap(affix[0].NameTextMapHash)
    obj.push(affixName)
  }
  return obj
}

const val = () => {
  let obj = {
    part2mainkey: part2mainkey,
    mainkey2mainvalue: mainkey2mainvalue(),
    secondkey2secondvalue: secondkey2secondvalue(),
    alternative: alternative()
  }
  fs.outputJsonSync('src/db/artifactVal.json', obj)
}
val()