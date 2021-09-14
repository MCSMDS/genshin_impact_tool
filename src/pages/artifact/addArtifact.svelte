<script>
  import Recognition from '@/algorithm/Recognition';
  import Verify from '@/algorithm/Verify';

  import Showresult from './step/showresult.svelte';
  import Setup from './step/setup.svelte';
  import Video2image from './step/video2image.svelte';
  import Readiamge from './step/readiamge.svelte';
  import Fixerror from './step/fixerror.svelte';
  import Progress from './step/progress.svelte';

  import { getArtifactBox } from '@/algorithm/Artifact';
  import { MediaFile, /* video2audio, */ getTimeDomainData, getLoudTimes, video2images, crop } from '@/algorithm/Media';
  import { video2audio } from '@/algorithm/video';

  import { artifact, json, fixindex, myprogress } from '@/algorithm/StoreSystem';

  const {
    video,
    images,
    setting: { x, y, width, height }
  } = artifact;

  let showButton;
  $: showButton = $video && $video.type.includes('video');

  let step = 'setup';

  const buttonClick = async () => {
    switch (step) {
      case 'setup':
        {
          (showButton = false), ($myprogress = 0), (step = 'loading');
          let videofile = new MediaFile($video);
          let audio = await video2audio(videofile);
          let data = await getTimeDomainData(audio, 100);
          let time = getLoudTimes(data, 100);
          let image = await video2images(videofile, time);
          let box = getArtifactBox(image[0]);
          $images = image;
          [$x, $y, $width, $height] = box;
          (step = 'video2image'), ($myprogress = 0), (showButton = true);
        }
        break;
      case 'video2image':
        {
          (showButton = false), ($myprogress = 0), (step = 'loading');
          $images = $images.map((canvas) => new MediaFile(crop(canvas, $x, $y, $width, $height)));
          (step = 'readiamge'), ($myprogress = 0), (showButton = true);
        }
        break;
      case 'readiamge':
        {
          (showButton = false), ($myprogress = 0), (step = 'loading');
          let array = [];
          for (var index in $images) {
            const result = await Recognition($images[index]);
            array.push({ ...result, src: $images[index].toURL(), verify: Verify(result) });
          }
          $json = array;
          (step = 'fixerror'), ($myprogress = 0), (showButton = true);
          ($fixindex = -1), buttonClick();
        }
        break;
      case 'fixerror':
        {
          if ($fixindex + 1 == $json.length) {
            $json = JSON.parse(JSON.stringify($json.map((value) => ({ ...value, src: undefined, verify: undefined }))));
            (step = 'showresult'), (showButton = false);
          } else {
            $fixindex++;
            if (!$json[$fixindex].verify.includes(false)) buttonClick();
          }
        }
        break;
    }
  };
</script>

<div class="absolute inset-0 bg-white">
  <div class={(showButton ? 'h-full-10' : 'h-full') + ' p-3 overflow-auto'}>
    {#if step === 'loading'}
      <Progress />
    {/if}
    {#if step === 'setup'}
      <Setup />
    {/if}
    {#if step === 'video2image'}
      <Video2image />
    {/if}
    {#if step === 'readiamge'}
      <Readiamge />
    {/if}
    {#if step === 'fixerror'}
      <Fixerror />
    {/if}
    {#if step === 'showresult'}
      <Showresult />
    {/if}
  </div>
  <div class={showButton ? 'h-10' : 'hidden'}>
    <button class="p-2 w-full bg-blue-500 text-white" on:click={buttonClick}> 下一步 </button>
  </div>
</div>

<style>
  .h-full-10 {
    height: calc(100% - theme('spacing.10'));
  }
</style>
