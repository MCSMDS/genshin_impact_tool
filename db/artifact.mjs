import fs from 'fs-extra'
import fetch from 'node-fetch'
import { readJsonData, readTextMap } from './utility.mjs'

const jsondata = readJsonData({
  ReliquarySetExcelConfigData: {},
  ReliquaryExcelConfigData: {},
  EquipAffixExcelConfigData: {},
  ReliquaryCodexExcelConfigData: {}
})

const getIcon = (name, should) => {
  const download = async () => {
    const res = await fetch(`https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/${name}.png`)
    fs.outputFileSync(`src/db/icon/artifact/${name}.png`, await res.buffer())
  }
  should && download()
  return name
}

const artifact = async withicon => {
  const obj = []
  for (let data of jsondata.ReliquarySetExcelConfigData.filter(json => !json.DisableFilter)) {
    let affix = jsondata.EquipAffixExcelConfigData.filter(json => json.Id == data.EquipAffixId)
    let affixName = readTextMap(affix[0].NameTextMapHash)
    let affixList = affix.map(json => {
      return readTextMap(json.DescTextMapHash)
    })
    for (let id of data.ContainsList) {
      let artifact = jsondata.ReliquaryExcelConfigData.find(json => json.Id == id)
      obj.push({
        Name: readTextMap(artifact.NameTextMapHash),
        Icon: getIcon(artifact.Icon, withicon),
        EquipType: readTextMap(artifact.EquipType),
        Affix: [affixName, ...affixList]
      })
    }
  }
  fs.outputJsonSync('src/db/artifact.json', obj)
}

export default artifact