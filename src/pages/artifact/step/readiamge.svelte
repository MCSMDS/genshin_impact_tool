<script>
  import { images } from "@/algorithm/StoreSystem";
</script>

{#each $images as image}
   <img src={URL.createObjectURL(image.file)} alt="" />
{/each}
