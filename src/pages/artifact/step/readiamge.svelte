<script>
  import { images } from "@/systen/StoreSystem";
</script>

{#each $images as image}
   <img src={URL.createObjectURL(image.file)} alt="" />
{/each}
