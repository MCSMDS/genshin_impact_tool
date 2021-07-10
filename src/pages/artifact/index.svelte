<script>
  import Artifactlist from './artifactlist'
  import AddArtifact from './addArtifact'
  let open = false
</script>

<div class="relative h-full p-2 overflow-hidden">
  <div class="h-full  pb-14 relative">
    <Artifactlist />
    {#if open}
      <AddArtifact />
    {/if}
  </div>
  <div class="absolute bottom-2 right-2 text-white text-2xl">
    <button
      class="h-12 w-12 rounded-full focus:outline-none shadow bg-blue-500 active:bg-blue-700 canhover:hover:bg-blue-600 canhover:active:bg-blue-700"
      on:click={() => (open = !open)}
    >
      {open ? '<' : '+'}
    </button>
  </div>
</div>
