import fs from 'fs-extra'
import Big from 'big.js'
import fetch from 'node-fetch'
import { readJsonData, readTextMap } from './utility.mjs'

const jsondata = readJsonData({
  AvatarCodexExcelConfigData: {},
  AvatarExcelConfigData: {},
  AvatarPromoteExcelConfigData: {},
  AvatarCurveExcelConfigData: {},
  FetterInfoExcelConfigData: {},
  AvatarSkillDepotExcelConfigData: {},
  AvatarSkillExcelConfigData: {},
  ProudSkillExcelConfigData: {}
})

const getIcon = async (name, should) => {
  const download = async () => {
    console.log(name)
    const res = await fetch(`https://upload-bbs.mihoyo.com/game_record/genshin/character_icon/${name}.png`)
    console.log(name)
    fs.outputFileSync(`src/db/icon/char/${name}.png`, await res.buffer())
  }
  should && await download()
  return name
}

function getProp(data) {
  const [hp, atk, def] = data.PropGrowCurves.map(el => el.GrowCurve)
  const decodePromote = el => el.AddProps.filter(el => el.Value).map(el => [readTextMap(el.PropType) + (el.PropType.includes('PERCENT') ? '%' : ''), el.Value])
  const result = Object.keys(Array(90).fill()).map(i => +i + 1)
    .flatMap(level => {
      const CurveInfos = jsondata.AvatarCurveExcelConfigData.find(el => el.Level === level).CurveInfos
      const Promote = jsondata.AvatarPromoteExcelConfigData.filter(el => el.AvatarPromoteId === data.AvatarPromoteId && el.UnlockMaxLevel >= level)
      const base = {
        基础生命值: Big(data.HpBase).times(CurveInfos.find(el => el.Type === hp).Value).toNumber(),
        基础攻击力: Big(data.AttackBase).times(CurveInfos.find(el => el.Type === atk).Value).toNumber(),
        基础防御力: Big(data.DefenseBase).times(CurveInfos.find(el => el.Type === def).Value).toNumber(),
        暴击率: data.Critical,
        暴击伤害: data.CriticalHurt
      }
      const result = []
      if (level === 90 || level !== Promote[0].UnlockMaxLevel) {
        const a = { Level: `${level}`, ...base }
        decodePromote(Promote[0]).map(([key, value]) => a[key] = Big(a[key] || 0).plus(value).toNumber())
        result.push(a)
      } else {
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

function getA(data) {
  let a = jsondata.AvatarSkillDepotExcelConfigData.find(el => el.Id === data.SkillDepotId).Skills[0]
  let b = jsondata.AvatarSkillExcelConfigData.find(el => el.Id === a).ProudSkillGroupId
  let c = jsondata.ProudSkillExcelConfigData.filter(el => el.ProudSkillGroupId === b)
  return c.map(el => el.ParamDescList.map(e => readTextMap(e)).filter(e => e)
    .map(e => {
      e.match(/{param\d+:\w+}/g).forEach(abcd =>
        e = e.replace(abcd, el.ParamList[abcd.match(/{param(\d+):\w+}/)[1] - 1])
      );
      let [key, value] = e.split('|')
      if (value.includes('+')) value = value.split('+').reduce((a, b) => a.plus(b), Big(0)).toNumber()
      else if (value.includes('*')) value = value.split('*').reduce((a, b) => a.times(b), Big(1)).toNumber()
      else if (value.includes('/')) value = value.split('/').map(a => Big(a).toNumber());
      else value = Big(value.match(/\d*\.*\d+/)[0]).toNumber()
      return [key, value]
    })
  ).map(e => Object.fromEntries(e))
}

const char = async withicon => {
  const result = await jsondata.AvatarCodexExcelConfigData
    .sort((a, b) => a.BeginTime > b.BeginTime ? 1 : -1)
    .map(a => jsondata.AvatarExcelConfigData.find(b => a.AvatarId === b.Id))
    .mapSync(async data => ({
      Name: readTextMap(data.NameTextMapHash),
      Icon: await getIcon(data.IconName, withicon),
      WeaponType: readTextMap(data.WeaponType),
      Vision: readTextMap(jsondata.FetterInfoExcelConfigData.find(el => el.AvatarId === data.Id).AvatarVisionBeforTextMapHash),
      Prop: getProp(data),
      A: getA(data)
    }))
  fs.outputJsonSync('src/db/char.json', result)
}

export default char