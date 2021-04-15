const fs = require('fs-extra');
const fetch = require('node-fetch');

const readJsonData = async () => {
  const jsondata = {
    ReliquarySetExcelConfigData: {},
    ReliquaryExcelConfigData: {},
    EquipAffixExcelConfigData: {},
    ManualTextMapConfigData: {},
    TextMapCHS: {},
    ReliquaryCodexExcelConfigData: {}
  };
  for (const name of Object.keys(jsondata)) {
    jsondata[name] = await fs.readJson(`GenshinData/${name}.json`);
  }
  return jsondata;
};

const geticon = async name => {
  let a = await fetch(`https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/${name}.png`);
  a = await a.buffer()
  return a.toString('base64');
}

(async () => {
  const jsondata = await readJsonData();
  const obj = []

  for (let data of jsondata.ReliquarySetExcelConfigData.filter(json => !json.DisableFilter)) {
    let affix = jsondata.EquipAffixExcelConfigData.filter(json => json.Id == data.EquipAffixId)
    let affixName = jsondata.TextMapCHS[affix[0].NameTextMapHash]
    let affixList = affix.map(json => {
      return jsondata.TextMapCHS[json.DescTextMapHash];
    })
    for (let id of data.ContainsList) {
      let artifact = jsondata.ReliquaryExcelConfigData.find(json => json.Id == id)
      obj.push({
        Name: jsondata.TextMapCHS[artifact.NameTextMapHash],
        EquipType: jsondata.TextMapCHS[jsondata.ManualTextMapConfigData.find(json => json.TextMapId == artifact.EquipType).TextMapContentTextMapHash],
        Affix: [affixName, ...affixList],
        icon: await geticon(artifact.Icon)
      });
    }
  }
  /*   jsondata.ReliquaryCodexExcelConfigData.map(({ CupId, LeatherId, CapId, FlowerId, SandId }) => {
  
  
      const getData = (id) => {
        let artifact = jsondata.ReliquaryExcelConfigData.find(json => json.Id ==id)
        if(!artifact)return;
        obj.push({
        Name: jsondata.TextMapCHS[artifact.NameTextMapHash],
          EquipType: jsondata.TextMapCHS[jsondata.ManualTextMapConfigData.find(json => json.TextMapId == artifact.EquipType).TextMapContentTextMapHash],
        })
      }
      getData(CupId)
      getData(LeatherId)
      getData(CapId)
      getData(FlowerId)
      getData(SandId)
  
  
    }) */

  fs.writeJsonSync('src/assets/artifact.json', obj);




})();