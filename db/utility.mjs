import fs from 'fs-extra'

Array.prototype.mapSync = async function (callback) {
  const new_array = []
  for (const element of this) new_array.push(await callback(element))
  return new_array
};

export const readJsonData = map => {
  for (const key of Object.keys(map)) {
    map[key] = fs.readJsonSync(`db/GenshinData/${key}.json`)
  }
  return map
}

export const readTextMap = (jsondata => id => {
  return jsondata.TextMapCHS[id] || jsondata.TextMapCHS[(jsondata.ManualTextMapConfigData.find(el => el.TextMapId == id) || {}).TextMapContentTextMapHash]
})(readJsonData({
  ManualTextMapConfigData: {},
  TextMapCHS: {}
}))