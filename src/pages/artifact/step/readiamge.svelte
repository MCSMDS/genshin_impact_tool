<script>
  import { artifact } from '@/algorithm/StoreSystem';
  const { images } = artifact;
</script>

{#each $images as image}
  <img src={image.toURL()} alt="" id="input" />
{/each}

<canvas id="output" />
