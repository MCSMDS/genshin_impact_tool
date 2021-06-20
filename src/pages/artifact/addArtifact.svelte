<script>
  import imageReader from "@/algorithm/imageReader";
  import Recognition from "@/algorithm/Recognition";
  import Verify from "@/algorithm/Verify";

  import Showresult from "./step/showresult.svelte";
  import Setup from "./step/setup.svelte";
  import Video2image from "./step/video2image.svelte";
  import Readiamge from "./step/readiamge.svelte";
  import Fixerror from "./step/fixerror.svelte";
  import Progress from "./step/progress.svelte";

  import FileSystem from "@/algorithm/FileSystem";

  import { video } from "@/algorithm/StoreSystem";
  import { thenum } from "@/algorithm/StoreSystem";
  import { images } from "@/algorithm/StoreSystem";
  import { json } from "@/algorithm/StoreSystem";
  import { fixindex } from "@/algorithm/StoreSystem";
  import { myprogress } from "@/algorithm/StoreSystem";

  import { plus, fixPercentage } from "@/algorithm/MathSystem";

  let showButton;
  $: showButton = $video && $video.type.includes("video");

  let step = "setup";

  const buttonClick = async () => {
    switch (step) {
      case "setup":
        step = "video2image";
        break;
      case "video2image":
        (showButton = false), ($myprogress = 0), (step = "loading");
        $images = await imageReader(new FileSystem($video), $thenum, (progress) => ($myprogress = progress));
        console.log($images);
        (step = "readiamge"), ($myprogress = 0), (showButton = true);
        break;
      case "readiamge":
        (showButton = false), ($myprogress = 0), (step = "loading");
        let array = [];
        for (var index in $images) {
          const result = await Recognition($images[index], (progress) => ($myprogress = fixPercentage(plus(index * 100, progress), $images.length * 100)));
          array.push({
            ...result,
            src: URL.createObjectURL($images[index].file),
            verify: Verify(result),
          });
        }
        $json = array;
        console.log($json);
        (step = "fixerror"), ($myprogress = 0), (showButton = true);
        ($fixindex = -1), buttonClick();
        break;
      case "fixerror":
        if ($fixindex + 1 == $json.length) {
          $json = JSON.parse(
            JSON.stringify(
              $json.map((value) => ({
                ...value,
                src: undefined,
                verify: undefined,
              }))
            )
          );
          console.log($json);
          (step = "showresult"), (showButton = false);
        } else {
          $fixindex++;
          if (!$json[$fixindex].verify.includes(false)) buttonClick();
        }
        break;
    }
  };
</script>

<div class="absolute inset-0 bg-white">
  <div class={(showButton ? "h-full-10" : "h-full") + " p-4 overflow-auto"}>
    {#if step == "loading"}
      <Progress />
    {/if}
    {#if step == "setup"}
      <Setup />
    {/if}
    {#if step == "video2image"}
      <Video2image />
    {/if}
    {#if step == "readiamge"}
      <Readiamge />
    {/if}
    {#if step == "fixerror"}
      <Fixerror />
    {/if}
    {#if step == "showresult"}
      <Showresult />
    {/if}
  </div>
  <div class={showButton ? "h-10" : "hidden"}>
    <button class="p-2 w-full bg-blue-500 text-white" on:click={buttonClick}> 下一步 </button>
  </div>
</div>

<style>
  .h-full-10 {
    height: calc(100% - theme("spacing.10"));
  }
</style>
