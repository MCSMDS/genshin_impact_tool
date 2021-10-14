import path from 'path'
import fs from 'fs-extra'
import fetch from 'node-fetch'

const downloadData = async file => {
  let request = await fetch(`https://raw.githubusercontent.com/Dimbreath/GenshinData/master/${file}.json`)
  fs.outputFileSync(`db/GenshinData/${path.basename(file)}.json`, await request.buffer())
}

(async () => {
  //await downloadData('TextMap/TextMapCHS')
  //await downloadData('ExcelBinOutput/ManualTextMapConfigData')
  /* 
    await downloadData('ExcelBinOutput/ReliquarySetExcelConfigData')
    await downloadData('ExcelBinOutput/ReliquaryExcelConfigData')
    await downloadData('ExcelBinOutput/EquipAffixExcelConfigData')
    await downloadData('ExcelBinOutput/ReliquaryCodexExcelConfigData')
   */
  /*   
    await downloadData('ExcelBinOutput/AvatarCodexExcelConfigData')
    await downloadData('ExcelBinOutput/AvatarExcelConfigData')
    await downloadData('ExcelBinOutput/AvatarPromoteExcelConfigData')
    await downloadData('ExcelBinOutput/AvatarCurveExcelConfigData')
    await downloadData('ExcelBinOutput/FetterInfoExcelConfigData')
    await downloadData('ExcelBinOutput/AvatarSkillDepotExcelConfigData')
    await downloadData('ExcelBinOutput/AvatarSkillExcelConfigData')
    await downloadData('ExcelBinOutput/ProudSkillExcelConfigData')
   */
  /* 
    await downloadData('ExcelBinOutput/ReliquaryAffixExcelConfigData')
    await downloadData('ExcelBinOutput/ReliquaryLevelExcelConfigData')
   */
  /* 
    await downloadData('ExcelBinOutput/WeaponCodexExcelConfigData')
    await downloadData('ExcelBinOutput/WeaponExcelConfigData')
    await downloadData('ExcelBinOutput/WeaponCurveExcelConfigData')
    await downloadData('ExcelBinOutput/WeaponPromoteExcelConfigData')
     */
})()