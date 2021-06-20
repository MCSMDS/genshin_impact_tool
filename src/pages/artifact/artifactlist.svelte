<script>
  import ajson from "@/db/artifact.json";
  let list;
  $: list = JSON.parse(localStorage.artifact || "[]");
  const iconurl = (icon) => (import.meta.env.DEV ? "src/" : "") + `db/artifact/${icon}.png`;
</script>

<div class="h-full overflow-auto">
  {#if list.length}
    {#each list as { part, main, second1, second2, second3, second4, alternative }}
      <div>
        <div class="text-top p-1">
          <div class="text-title border-4 pl-2">
            <p class="text-white text-xl">{ajson.find((el) => el.EquipType == part && el.Affix[0] == alternative).Name}</p>
          </div>
        </div>
        <div class="text-middle p-2 pl-4 flex">
          <div class="relative w-2/3">
            <p class="text-white text-base">{part}</p>
            <div class="absolute bottom-0">
              <p class="text-part text-xs">{main.name}</p>
              <p class="text-white text-2xl">{main.value}</p>
            </div>
          </div>
          <img class="h-32 w-32" src={iconurl(ajson.find((el) => el.EquipType == part && el.Affix[0] == alternative).Icon)} alt="" />
        </div>
        <div class="text-bottom p-4">
          <ul class="list-disc list-inside">
            <li class="text-second text-base">{second1.name}+{second1.value}</li>
            <li class="text-second text-base">{second2.name}+{second2.value}</li>
            <li class="text-second text-base">{second3.name}+{second3.value}</li>
            <li class="text-second text-base">{second4.name}+{second4.value}</li>
          </ul>
          <p class="text-alter text-base my-2">{alternative}:</p>
          <ul class="list-disc pl-6">
            <li class="text-affix text-base">2件套: {ajson.find((el) => el.EquipType == part && el.Affix[0] == alternative).Affix[1]}</li>
            <li class="text-affix text-base">4件套: {ajson.find((el) => el.EquipType == part && el.Affix[0] == alternative).Affix[2]}</li>
          </ul>
        </div>
      </div>
    {/each}
  {:else}
    <div class="h-full flex flex-col justify-center">
      <h1 class="text-center text-xl">无圣遗物</h1>
    </div>
  {/if}
</div>

<style>
  @font-face {
    font-family: "yuanshen";
    src: url("yuanshen.ttf");
  }
  p,
  li {
    font-family: yuanshen;
  }
  .text-top {
    background: #be6c32;
  }
  .text-middle {
    background: linear-gradient(90deg, #7c5b52, #ac7b53, #dca451);
  }
  .text-bottom {
    background: #ede5d8;
  }
  .text-title {
    border-color: #a05c2e;
  }
  .text-part {
    color: #b7a59b;
  }
  .text-second {
    color: #66697a;
  }
  .text-alter {
    color: #67b05e;
  }
  .text-affix {
    color: #909291;
    list-style-type: "🛇 ";
  }
</style>
