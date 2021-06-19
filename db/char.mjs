import fs from 'fs-extra';
import Big from 'big.js';
import { readJsonData, readTextMap } from './utility.mjs';

export default async () => {
  const jsondata = readJsonData({
    AvatarCodexExcelConfigData: {},
    AvatarExcelConfigData: {},
    AvatarPromoteExcelConfigData: {},
    AvatarCurveExcelConfigData: {},
    FetterInfoExcelConfigData: {},
    AvatarSkillDepotExcelConfigData: {},
    AvatarSkillExcelConfigData: {},
    ProudSkillExcelConfigData: {},
    TextMapCHS:{}
  });
  const charid = jsondata.AvatarCodexExcelConfigData.sort((a, b) => a.BeginTime > b.BeginTime ? 1 : -1).map(el => el.AvatarId)
  const obj = []

  charid.map(id => {
    const data = jsondata.AvatarExcelConfigData.find(json => json.Id == id);
    //if (readTextMap(data.NameTextMapHash) != '迪卢克') return;
    //if (readTextMap(data.NameTextMapHash) != '香菱') return;

    function getProp() {
      let arr = {};
      let [hp, atk, def, crit, crithurt] = [data.HpBase, data.AttackBase, data.DefenseBase, data.Critical, data.CriticalHurt];
      let [[hpn, hplv], [atkn, atklv], [defn, deflv]] = data.PropGrowCurves.map(json =>
        [readTextMap(json.Type), json.GrowCurve]
      );
      let promote = jsondata.AvatarPromoteExcelConfigData.filter(json => json.AvatarPromoteId == data.AvatarPromoteId);
      for (let { Level, CurveInfos } of jsondata.AvatarCurveExcelConfigData) {
        if (Level > 90) break;
        let abc = promote.filter(el => el.UnlockMaxLevel >= Level);
        let add = abc[0].AddProps.reduce((a, b) => (a[b.PropType] = b.Value, a), {})
        let infos = CurveInfos.reduce((a, b) => (a[b.Type] = b.Value, a), {})
        let basecls = {
          [hpn]: Big(hp).times(infos[hplv]).toNumber(),
          [atkn]: Big(atk).times(infos[atklv]).toNumber(),
          [defn]: Big(def).times(infos[deflv]).toNumber(),
          '暴击率': crit,
          '暴击伤害': crithurt
        };
        let other = abc[0].AddProps[3];
        let othername = readTextMap(other.PropType)
        if (other.PropType.includes('PERCENT')) othername += '%'
        basecls[othername] = Big(basecls[othername] || 0).plus(other.Value || 0).toNumber();
        if (Level == 90 || Level != abc[0].UnlockMaxLevel) {
          let a = arr[Level] = { ...basecls };
          a[hpn] = Big(a[hpn]).plus(add.FIGHT_PROP_BASE_HP || 0).toNumber();
          a[atkn] = Big(a[atkn]).plus(add.FIGHT_PROP_BASE_ATTACK || 0).toNumber();
          a[defn] = Big(a[defn]).plus(add.FIGHT_PROP_BASE_DEFENSE || 0).toNumber();
        } else {
          let next = abc[1].AddProps.reduce((a, b) => (a[b.PropType] = b.Value, a), {})
          let a = arr[Level + '-'] = { ...basecls };
          a[hpn] = Big(a[hpn]).plus(add.FIGHT_PROP_BASE_HP || 0).toNumber();
          a[atkn] = Big(a[atkn]).plus(add.FIGHT_PROP_BASE_ATTACK || 0).toNumber();
          a[defn] = Big(a[defn]).plus(add.FIGHT_PROP_BASE_DEFENSE || 0).toNumber();
          let b = arr[Level + '+'] = { ...basecls };
          b[hpn] = Big(b[hpn]).plus(next.FIGHT_PROP_BASE_HP || 0).toNumber();
          b[atkn] = Big(b[atkn]).plus(next.FIGHT_PROP_BASE_ATTACK || 0).toNumber();
          b[defn] = Big(b[defn]).plus(next.FIGHT_PROP_BASE_DEFENSE || 0).toNumber();
        }
      }
      return arr;
    }

    function getA() {
      let a = jsondata.AvatarSkillDepotExcelConfigData.find(el => el.Id == data.SkillDepotId).Skills[0]
      let b = jsondata.AvatarSkillExcelConfigData.find(el => el.Id == a).ProudSkillGroupId
      let c = jsondata.ProudSkillExcelConfigData.filter(el => el.ProudSkillGroupId == b)
      return c.map(el => el.ParamDescList.map(e => readTextMap(e)).filter(e => e)
        .map(e => {
          e.match(/{param\d+:\w+}/g).forEach(abcd =>
            e = e.replace(abcd, el.ParamList[abcd.match(/{param(\d+):\w+}/)[1] - 1])
          );
          let [key, value] = e.split('|');
          if (value.includes('+')) value = value.split("+").reduce((a, b) => a.plus(b), Big(0)).toNumber();
          else if (value.includes('*')) value = value.split("*").reduce((a, b) => a.times(b), Big(1)).toNumber();
          else if (value.includes('/')) value = value.split("/").map(a => Big(a).toNumber());
          else value = Big(value.match(/\d*\.*\d+/)[0]).toNumber()
          return [key, value];
        })
      ).map(e => Object.fromEntries(e))
    }

    obj.push({
      Name: readTextMap(data.NameTextMapHash),
      WeaponType: readTextMap(data.WeaponType),
      Vision: readTextMap(jsondata.FetterInfoExcelConfigData.find(json => json.AvatarId == id).AvatarVisionBeforTextMapHash),
      Prop: getProp(),
      A: getA()
    });
  })

  fs.writeJsonSync('src/assets/char.json', obj);
};