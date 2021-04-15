<script>
  import Damage from "@/algorithm/Damage";
  import imgUrl from "@/assets/char.json";
  var list = [];

  function abcd() {
    list = [];
    imgUrl.forEach(({ Name, WeaponType, Vision, Prop, A }) => {
      let out = [
        Name,
        ...Damage(
          WeaponType == "法器" ? Vision : "phys",
          Prop["90"]["基础攻击力"],
          0,
          A[9]["一段伤害"] || A[9]["普通攻击伤害"],
          Object.entries(Prop["90"]).splice(3)
        ),
      ];
      list.push(out);
      console.log(out);
    });
    list.sort((a, b) => b[1] - a[1]);
  }
</script>

<p>这里也没弄好</p>
<button on:click={abcd}>危险按钮</button>

{#each list as [name, mark]}
  <p>{name} {mark.toFixed()}</p>
{/each}
