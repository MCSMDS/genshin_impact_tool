<script>
  import Char from "@/icon/char.svelte";
  import Weapon from "@/icon/weapon.svelte";
  import Artifact from "@/icon/artifact.svelte";
  import Puzzle from "@/icon/puzzle.svelte";

  import A from "@/pages/char";
  import B from "@/pages/weapon";
  import C from "@/pages/artifact";
  import D from "@/pages/other";

  let page = A;
</script>

<div class="h-full">
  <div class="h-full-12 overflow-auto">
    <svelte:component this={page} />
  </div>
  <div class="h-12 flex shadowtop">
    <button class="w-full focus:outline-none active:bg-gray-300 canhover:hover:bg-gray-200 canhover:active:bg-gray-300" on:click={() => (page = A)}>
      <Char class={"w-full h-10 fill-current " + (page == A ? "text-blue-500" : "text-gray-600")} />
    </button>
    <button class="w-full focus:outline-none active:bg-gray-300 canhover:hover:bg-gray-200 canhover:active:bg-gray-300" on:click={() => (page = B)}>
      <Weapon class={"w-full h-10 fill-current " + (page == B ? "text-blue-500" : "text-gray-600")} />
    </button>
    <button class="w-full focus:outline-none active:bg-gray-300 canhover:hover:bg-gray-200 canhover:active:bg-gray-300" on:click={() => (page = C)}>
      <Artifact class={"w-full h-10 fill-current " + (page == C ? "text-blue-500" : "text-gray-600")} />
    </button>
    <button class="w-full focus:outline-none active:bg-gray-300 canhover:hover:bg-gray-200 canhover:active:bg-gray-300" on:click={() => (page = D)}>
      <Puzzle class={"w-full h-10 fill-current " + (page == D ? "text-blue-500" : "text-gray-600")} />
    </button>
  </div>
</div>

<style>
  .h-full-12 {
    height: calc(100% - theme("spacing.12"));
  }
  .shadowtop {
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
  }
</style>
