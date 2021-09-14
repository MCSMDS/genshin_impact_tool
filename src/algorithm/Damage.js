import Big from 'big.js'

const plus = (a, b) => Big(a).plus(b).toNumber()
const times = (a, b) => Big(a).times(b).toNumber()
const product = (...args) => args.reduce((big, num) => big.times(num), Big(1)).toNumber()

let db = {
  'flower': {
    '生命值': 4780
  },
  'feather': {
    '攻击力': 311
  },
  'sand': {
    //'防御力%': 0.583,
    //'生命值%': 0.466,
    '攻击力%': 0.466
    //'元素充能效率': 0.518,
    //'元素精通': 187
  },
  'cup': {
    //'防御力%': 0.583,
    //'生命值%': 0.466,
    '攻击力%': 0.466,
    '岩元素伤害加成': 0.466,
    '水元素伤害加成': 0.466,
    '雷元素伤害加成': 0.466,
    '风元素伤害加成': 0.466,
    '火元素伤害加成': 0.466,
    '冰元素伤害加成': 0.466,
    '物理伤害加成': 0.583
    //'元素精通': 187
  },
  'head': {
    //'防御力%': 0.583,
    //'生命值%': 0.466,
    '攻击力%': 0.466,
    '暴击率': 0.311,
    '暴击伤害': 0.622
    //'治疗加成': 0.359,
    //'元素精通': 187
  },
  'second': {
    '攻击力%': 0.058,
    //'生命值%': 0.058,
    //'防御力%': 0.073,
    //'元素充能效率': 0.065,
    '暴击率': 0.039,
    '暴击伤害': 0.078,
    '攻击力': 19
    //'生命值': 299,
    //'防御力': 23,
    //'元素精通': 23
  }
}

let damage = (character, weapon, percentage, fixed, skilltimes, bonus, critrate, critdamage) => {
  let getAtk = plus(times(plus(character, weapon), plus(1, percentage)), fixed)
  let gettimes = skilltimes
  let getbonus = plus(1, bonus)
  let getcrit = plus(1, times(Math.min(critrate, 1), critdamage))
  return product(getAtk, gettimes, getbonus, getcrit)
}

let cartesianProduct = (...args) => args.reduce((a, b) => {
  const result = []
  a.forEach(a => b.forEach(b => result.push([...a, b])))
  return result
}, [[]])

let combine = (arr, len) => {
  if (len === 1) return arr.map(a => [a])
  const result = []
  arr.forEach((a, i) => {
    const smaller = combine(arr.slice(i + 1), len - 1)
    smaller.forEach(b => result.push([a].concat(b)))
  })
  return result
}

let flat = input => {
  var output = {}
  for (var obj of Object.values(input)) {
    for (var [key, value] of Object.entries(obj)) {
      output[key] = (output[key] || 0) + value
    }
  }
  return output
}

let mains = cartesianProduct(
  Object.entries(db.flower),
  Object.entries(db.feather),
  Object.entries(db.sand),
  Object.entries(db.cup),
  Object.entries(db.head)
)

function getBest(panel, element) {
  var second = {
    'flower': {},
    'feather': {},
    'sand': {},
    'cup': {},
    'head': {}
  }
  element = element
    .replace('phys', '物理伤害加成')
    .replace('雷', '雷元素伤害加成')
    .replace('岩', '岩元素伤害加成')
    .replace('风', '风元素伤害加成')
    .replace('水', '水元素伤害加成')
    .replace('火', '火元素伤害加成')
  function upgrade() {
    function tries(key) {
      var clone = JSON.parse(JSON.stringify(second))
      for (var part in clone) {
        const obj = clone[part]
        const values = Object.values(obj)
        if ((values.length == 4 ? obj[key] : !obj[key]) && (obj[key] || 0) < 6 && values.reduce((a, b) => a + b, 0) < 9) {
          obj[key] = (obj[key] || 0) + 1
          break
        }
      }
      var obj = flat(clone)
      var dmg = damage(
        panel['角色攻击力'] || 0,
        panel['武器攻击力'] || 0,
        plus(times(db.second['攻击力%'], obj['攻击力%'] || 0), panel['攻击力%'] || 0),
        plus(times(db.second['攻击力'], obj['攻击力'] || 0), panel['攻击力'] || 0),
        panel['技能倍率'] || 0,
        panel[element] || 0,
        plus(times(db.second['暴击率'], obj['暴击率'] || 0), panel['暴击率'] || 0),
        plus(times(db.second['暴击伤害'], obj['暴击伤害'] || 0), panel['暴击伤害'] || 0)
      )
      return [dmg, () => second = clone]
    };
    Object.keys(db.second).map(tries).sort((a, b) => b[0] - a[0])[0][1]()
  }
  for (var i = 0; i < 45; i++)upgrade()

  for (var [key, value] of Object.entries(flat(second))) {
    panel[key] = plus(panel[key] || 0, times(db.second[key], value))
  }

  var dmg = damage(
    panel['角色攻击力'] || 0,
    panel['武器攻击力'] || 0,
    panel['攻击力%'] || 0,
    panel['攻击力'] || 0,
    panel['技能倍率'] || 0,
    panel[element] || 0,
    panel['暴击率'] || 0,
    panel['暴击伤害'] || 0
  )
  return [dmg, panel]
}

const getartifacs = (element, character, weapon, skilltimes, other) => {
  let artifacs = []
  for (let main of mains) {
    let panel = {
      '角色攻击力': character,
      '武器攻击力': weapon,
      '技能倍率': skilltimes
    }
    for (var [key, value] of other) panel[key] = plus(panel[key] || 0, value)
    for (var [key, value] of main) panel[key] = plus(panel[key] || 0, value)
    artifacs.push(getBest(panel, element))
  }
  return [...artifacs].sort((a, b) => b[0] - a[0])[0]
}

export default getartifacs