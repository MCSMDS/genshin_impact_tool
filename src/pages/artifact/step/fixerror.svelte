<script>
  import Form from "./form.svelte";
  import Verify from "@/algorithm/Verify";
  import { json, fixindex } from "@/systen/StoreSystem";

  $: $json[$fixindex].verify = Verify($json[$fixindex]);

  const select1 = ["生之花", "死之羽", "时之沙", "空之杯", "理之冠"];

  const select2 = [
    "攻击力",
    "防御力",
    "生命值",
    "暴击率",
    "暴击伤害",
    "元素精通",
    "元素充能效率",
    "治疗加成",
    "物理伤害加成",
    "火元素伤害加成",
    "雷元素伤害加成",
    "冰元素伤害加成",
    "水元素伤害加成",
    "风元素伤害加成",
    "岩元素伤害加成",
  ];

  const select3 = [
    "攻击力",
    "防御力",
    "生命值",
    "暴击率",
    "暴击伤害",
    "元素精通",
    "元素充能效率",
  ];

  const select4 = [
    "冰风迷途的勇士",
    "平息鸣雷的尊者",
    "渡过烈火的贤人",
    "被怜爱的少女",
    "角斗士的终幕礼",
    "翠绿之影",
    "流浪大地的乐团",
    "如雷的盛怒",
    "炽烈的炎之魔女",
    "昔日宗室之仪",
    "染血的骑士道",
    "悠古的磐岩",
    "逆飞的流星",
    "沉沦之心",
    "千岩牢固",
    "苍白之火",
  ];
</script>

<img src={$json[$fixindex].src} alt="" />
<div>
  <Form
    second={$json[$fixindex].part}
    select={select1}
    error={$json[$fixindex].verify[0]}
    noinput
    update={(value) => ($json[$fixindex].part = value)}
  />
  <Form
    second={$json[$fixindex].main}
    select={select2}
    error={$json[$fixindex].verify[1]}
    update={(value) => ($json[$fixindex].main = value)}
  />
  <Form
    second={$json[$fixindex].second1}
    select={select3}
    error={$json[$fixindex].verify[2]}
    update={(value) => ($json[$fixindex].second1 = value)}
  />
  <Form
    second={$json[$fixindex].second2}
    select={select3}
    error={$json[$fixindex].verify[3]}
    update={(value) => ($json[$fixindex].second2 = value)}
  />
  <Form
    second={$json[$fixindex].second3}
    select={select3}
    error={$json[$fixindex].verify[4]}
    update={(value) => ($json[$fixindex].second3 = value)}
  />
  <Form
    second={$json[$fixindex].second4}
    select={select3}
    error={$json[$fixindex].verify[5]}
    update={(value) => ($json[$fixindex].second4 = value)}
  />
  <Form
    second={$json[$fixindex].alternative}
    select={select4}
    error={$json[$fixindex].verify[6]}
    noinput
    update={(value) => ($json[$fixindex].alternative = value)}
  />
</div>
