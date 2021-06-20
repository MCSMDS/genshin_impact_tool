import fs from 'fs-extra';
import Big from 'big.js'
import fetch from 'node-fetch';
import { readJsonData, readTextMap } from './utility.mjs'

const jsondata = readJsonData({
  WeaponCodexExcelConfigData: {},
  WeaponExcelConfigData: {},
  WeaponCurveExcelConfigData: {},
  WeaponPromoteExcelConfigData: {}
});

const getIcon = name => {
  const download = async () => {
    const res = await fetch(`https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/${name}.png`)
    fs.outputFileSync(`src/db/weapon/${name}.png`, await res.buffer())
  }
  //download()
  return name
}

function getProp(data) {
  const decodePromote = el => el.AddProps.filter(el => el.Value).map(el => [readTextMap(el.PropType) + (el.PropType.includes('PERCENT') ? '%' : ''), el.Value])
  const result = Object.keys(Array(90).fill()).map(i => +i + 1)
    .flatMap(level => {
      const CurveInfos = jsondata.WeaponCurveExcelConfigData.find(el => el.Level === level).CurveInfos
      const Promote = jsondata.WeaponPromoteExcelConfigData.filter(el => el.WeaponPromoteId === data.WeaponPromoteId && el.UnlockMaxLevel >= level)
      const base = Object.fromEntries(data.WeaponProp.filter(el => el.PropType).map(a => [
        readTextMap(a.PropType) + (a.PropType.includes('PERCENT') ? '%' : ''),
        Big(a.InitValue).times(CurveInfos.find(b => a.Type === b.Type).Value).toNumber()
      ]))
      const result = []
      if (Promote[0] && (level !== Promote[0].UnlockMaxLevel || !Promote[1])) {
        const a = { Level: `${level}`, ...base }
        decodePromote(Promote[0]).map(([key, value]) => a[key] = Big(a[key] || 0).plus(value).toNumber())
        result.push(a)
      } else if (Promote[0] && Promote[1]) {
        const a = { Level: `${level}-`, ...base }
        decodePromote(Promote[0]).map(([key, value]) => a[key] = Big(a[key] || 0).plus(value).toNumber())
        const b = { Level: `${level}+`, ...base }
        decodePromote(Promote[1]).map(([key, value]) => b[key] = Big(b[key] || 0).plus(value).toNumber())
        result.push(a, b)
      }
      return result
    })
  return result
}

const weapon = () => {
  const result = jsondata.WeaponCodexExcelConfigData
    .filter(el => !el.IsDeleteWatcherAfterFinish)
    .map(a => jsondata.WeaponExcelConfigData.find(b => a.WeaponId === b.Id))
    //.slice(89, 90)
    .map(data => ({
      Name: readTextMap(data.NameTextMapHash),
      Icon: getIcon(data.Icon),
      WeaponType: readTextMap(data.WeaponType),
      Prop: getProp(data)
    }))
  fs.outputJsonSync('src/db/weapon.json', result)
}

export default weapon