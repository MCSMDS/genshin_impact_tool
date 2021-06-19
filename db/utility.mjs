import fs from 'fs-extra';

export const readJsonData = map => {
  for (const key of Object.keys(map)) {
    map[key] = fs.readJsonSync(`db/GenshinData/${key}.json`);
  }
  return map;
};

export const readTextMap = (jsondata => id => {
  return jsondata.TextMapCHS[id] || jsondata.TextMapCHS[(jsondata.ManualTextMapConfigData.find(el => el.TextMapId == id) || {}).TextMapContentTextMapHash];
})(readJsonData({
  ManualTextMapConfigData: {},
  TextMapCHS: {}
}));