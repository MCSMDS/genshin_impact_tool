import inquirer from 'inquirer'
import char from './db/char.mjs'
import weapon from './db/weapon.mjs'
import artifact from './db/artifact.mjs'

inquirer.prompt([{
  type: 'list',
  name: 'mode',
  message: '选择:',
  choices: [
    '角色',
    '武器',
    '圣遗物'
  ]
}]).then(({ mode }) => {
  switch (mode) {
    case '角色': char(); break
    case '武器': weapon(); break
    case '圣遗物': artifact(); break
  }
})