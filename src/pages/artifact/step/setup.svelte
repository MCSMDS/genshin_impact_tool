<script>
  import Upload from "@/icon/upload.svelte";
  import { video } from "@/algorithm/StoreSystem";
  let uploader;
</script>

<div
  class="flex flex-col justify-center text-center h-full border-4 border-dashed rounded-xl"
  on:click={uploader.click()}
  on:drop|preventDefault={(e) => ($video = e.dataTransfer.files[0])}
  on:dragover|preventDefault
>
  <Upload class="h-14 mx-auto fill-current text-gray-400" />
  <p>点击或拖放上传游戏录屏</p>
  <input
    class="hidden"
    type="file"
    accept="video/*"
    bind:this={uploader}
    on:change={() => ($video = uploader.files[0])}
  />
</div>
