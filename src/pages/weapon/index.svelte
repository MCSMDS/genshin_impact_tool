<script>
  import char from "@/db/weapon.json";
  const iconurl = (icon) => (import.meta.env.DEV ? "src/db/icon" : "db") + `/weapon/${icon}.png`;
</script>

<div class="h-full overflow-auto">
  {#each char as { Name, Icon, WeaponType }}
    <div class="bg-blue-300 m-2 flex">
      <img class="w-24 h-24" src={iconurl(Icon)} alt="" />
      <div class="p-2 w-full flex flex-col justify-between">
        <p>名称: {Name}</p>
        <p>类型: {WeaponType}</p>
      </div>
    </div>
  {/each}
</div>
