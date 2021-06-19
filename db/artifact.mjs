import fs from 'fs-extra';
import fetch from 'node-fetch';
import { readJsonData, readTextMap } from './utility.mjs';

const geticon = async name => {
  let a = await fetch(`https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/${name}.png`);
  a = await a.buffer()
  return a.toString('base64');
}

export default async () => {
  const jsondata = readJsonData({
    ReliquarySetExcelConfigData: {},
    ReliquaryExcelConfigData: {},
    EquipAffixExcelConfigData: {},
    ReliquaryCodexExcelConfigData: {}
  });
  const obj = []

  for (let data of jsondata.ReliquarySetExcelConfigData.filter(json => !json.DisableFilter)) {
    let affix = jsondata.EquipAffixExcelConfigData.filter(json => json.Id == data.EquipAffixId)
    let affixName = readJsonData(affix[0].NameTextMapHash)
    let affixList = affix.map(json => {
      return readJsonData(json.DescTextMapHash);
    })
    for (let id of data.ContainsList) {
      let artifact = jsondata.ReliquaryExcelConfigData.find(json => json.Id == id)
      obj.push({
        Name: readJsonData(artifact.NameTextMapHash),
        EquipType: readJsonData(artifact.EquipType),
        Affix: [affixName, ...affixList],
        icon: await geticon(artifact.Icon)
      });
    }
  }
  /* 
    jsondata.ReliquaryCodexExcelConfigData.map(({ CupId, LeatherId, CapId, FlowerId, SandId }) => {
      const getData = (id) => {
        let artifact = jsondata.ReliquaryExcelConfigData.find(json => json.Id == id)
        if (!artifact) return;
        obj.push({
          Name: readJsonData(artifact.NameTextMapHash),
          EquipType: readJsonData(artifact.EquipType),
        })
      }
      getData(CupId)
      getData(LeatherId)
      getData(CapId)
      getData(FlowerId)
      getData(SandId)
    })
   */
  fs.writeJsonSync('src/assets/artifact.json', obj);
};