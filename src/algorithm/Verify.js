import val from '@/db/artifactVal.json'

const verifyPart = (part, main) => {
  let key = main.name + ((main.name === '生命值' || main.name === '攻击力') && main.value.includes('%') ? '%' : '')
  return val.part2mainkey.hasOwnProperty(part) && val.part2mainkey[part].includes(key)
}

const verifyMain = (part, main) => {
  let key = main.name + ((main.name === '生命值' || main.name === '攻击力') && main.value.includes('%') ? '%' : '')
  let name = val.part2mainkey.hasOwnProperty(part) && val.part2mainkey[part].includes(key)
  let value = val.mainkey2mainvalue.hasOwnProperty(key) && val.mainkey2mainvalue[key].includes(main.value)
  return name && value
}

const verifySecond = second => {
  let key = second.name + ((second.name === '生命值' || second.name === '攻击力' || second.name === '防御力') && second.value.includes('%') ? '%' : '')
  let value = val.secondkey2secondvalue.hasOwnProperty(key) && val.secondkey2secondvalue[key].includes(second.value)
  return value
}

const verifyAlternative = alternative => {
  return val.alternative.includes(alternative)
}

const verifymainlv = main => {
  let key = main.name + ((main.name === '生命值' || main.name === '攻击力') && main.value.includes('%') ? '%' : '')
  let lv = [];
  [[0, 5], [5, 10], [10, 23], [23, 40], [40, 61]].forEach((i, index) => {
    if (val.mainkey2mainvalue[key].slice(i[0], i[1]).includes(main.value)) {
      lv.push([index + 1, val.mainkey2mainvalue[key].slice(i[0], i[1]).indexOf(main.value)])
    }
  })
  return lv
}

const verifysecondlv = second => {
  let key = second.name + ((second.name === '生命值' || second.name === '攻击力' || second.name === '防御力') && second.value.includes('%') ? '%' : '')
  let lv = [];
  //2
  //3
  //4,7
  //4,7,10,10
  //4,7,10,10,10,10
  [[0, 2], [2, 5], [5, 16], [16, 47], [47, 98]].forEach((i, index) => {
    if (val.secondkey2secondvalue[key].slice(i[0], i[1]).includes(second.value)) {
      lv.push([index + 1, val.secondkey2secondvalue[key].slice(i[0], i[1]).indexOf(second.value)])
    }

  })
  return lv.map(([star, lv]) => {
    if (lv < 4) return [star, 1]
    if (lv < 4 + 7) return [star, 2]
    if (lv < 4 + 7 + 10) return [star, 3]
    if (lv < 4 + 7 + 10 + 10) return [star, 4]
    if (lv < 4 + 7 + 10 + 10 + 10) return [star, 5]
    if (lv < 4 + 7 + 10 + 10 + 10 + 10) return [star, 6]
  })
}

const Verify = element => {
  let verifys = [
    verifyPart(element.part, element.main),
    verifyMain(element.part, element.main),
    verifySecond(element.second1),
    verifySecond(element.second2),
    verifySecond(element.second3),
    verifySecond(element.second4),
    verifyAlternative(element.alternative)
  ]
  if (!verifys.includes(false)) {
    let a = verifymainlv(element.main)
    let b = verifysecondlv(element.second1)
    let c = verifysecondlv(element.second2)
    let d = verifysecondlv(element.second3)
    let e = verifysecondlv(element.second4)
    let f = false
    a.forEach(([star, lv]) => {
      let mark = star - 2 + lv / 4
      if (b.find(i => i[0] == star) && c.find(i => i[0] == star) && d.find(i => i[0] == star) && e.find(i => i[0] == star)) {
        let bmark = b.find(i => i[0] == star)[1] + c.find(i => i[0] == star)[1] + d.find(i => i[0] == star)[1] + e.find(i => i[0] == star)[1]
        if (mark == bmark || mark == bmark - 1) f = true
      }
    })
    console.log(f)
  }
  return verifys
}

export default Verify