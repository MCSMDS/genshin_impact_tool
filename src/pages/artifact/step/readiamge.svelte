<script>
  import { images } from "@/algorithm/StoreSystem";
</script>

{#each $images as image}
  <img src={image.toURL()} alt="" />
{/each}
