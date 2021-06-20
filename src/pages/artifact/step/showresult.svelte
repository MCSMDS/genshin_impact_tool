<script>
  import { json } from "@/algorithm/StoreSystem";
  import monaUranai from "@/algorithm/monaUranai";
  let result;
  $: result = JSON.stringify(monaUranai($json), null, 2);
</script>

<textarea class="h-full-10 w-full resize-none" bind:value={result} />

<button
  class="h-10 w-full bg-blue-400"
  on:click={() => (localStorage.artifact = JSON.stringify($json))}
>
  录入
</button>

<style>
  .h-full-10 {
    height: calc(100% - theme("spacing.12"));
  }
</style>
