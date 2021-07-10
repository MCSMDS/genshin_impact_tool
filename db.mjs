import inquirer from 'inquirer'
import char from './db/char.mjs'
import weapon from './db/weapon.mjs'
import artifact from './db/artifact.mjs'

const run = () => {
  inquirer.prompt([{
    type: 'list',
    name: 'mode',
    message: '选择:',
    choices: [
      '角色',
      '角色+图标',
      '武器',
      '武器+图标',
      '圣遗物',
      '圣遗物+图标',
      '关闭'
    ]
  }]).then(({ mode }) => {
    switch (mode) {
      case '角色': char(); break
      case '角色+图标': char(true); break
      case '武器': weapon(); break
      case '武器+图标': weapon(true); break
      case '圣遗物': artifact(); break
      case '圣遗物+图标': artifact(true); break
      case '关闭': return
    }
    //run()
  })
}
run()