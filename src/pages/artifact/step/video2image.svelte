<script>
  import { thenum } from "@/algorithm/StoreSystem";
</script>

<div class="flex rounded-md shadow">
  <span
    class="px-2 py-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500"
  >
    圣遗物读取量
  </span>
  <input
    type="number"
    placeholder="1"
    bind:value={$thenum}
    class="px-2 py-1 flex-1 appearance-none rounded-none rounded-r-md border outline-none border-gray-300 ring-inset ring-indigo-500 focus:ring-1  focus:border-indigo-500"
  />
</div>
