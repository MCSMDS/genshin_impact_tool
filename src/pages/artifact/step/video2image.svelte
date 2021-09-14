<script>
  import { artifact } from '@/algorithm/StoreSystem';
  import { MediaFile, crop } from '@/algorithm/Media';
  import { getArtifactContentBox } from '@/algorithm/Artifact';
  import cv from '@/algorithm/opencv';

  const {
    images,
    setting: { x, y, width, height },
  } = artifact;

  let abc = [];

  const colorText = (image) => {
    const area = getArtifactContentBox(new MediaFile(image));
    const canvas = document.createElement('canvas');
    const dst = cv.imread(image);
    area.map(([x, y, width, height]) => cv.rectangle(dst, new cv.Point(x, y), new cv.Point(x + width, y + height), new cv.Scalar(0, 0, 0, 255), 3));
    cv.imshow(canvas, dst);
    abc = area.map(([x, y, width, height]) => {
      return new MediaFile(crop(image, x, y, width, height)).toURL();
    });
    return canvas;
  };
</script>

<div class="flex rounded-md shadow mb-1">
  <span class="px-2 py-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">X</span>
  <input
    type="number"
    placeholder="1"
    bind:value={$x}
    class="px-2 py-1 flex-1 appearance-none rounded-none rounded-r-md border outline-none border-gray-300 ring-inset ring-indigo-500 focus:ring-1 focus:border-indigo-500"
  />
</div>

<div class="flex rounded-md shadow mb-1">
  <span class="px-2 py-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">Y</span>
  <input
    type="number"
    placeholder="1"
    bind:value={$y}
    class="px-2 py-1 flex-1 appearance-none rounded-none rounded-r-md border outline-none border-gray-300 ring-inset ring-indigo-500 focus:ring-1 focus:border-indigo-500"
  />
</div>

<div class="flex rounded-md shadow mb-1">
  <span class="px-2 py-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">Width</span>
  <input
    type="number"
    placeholder="1"
    bind:value={$width}
    class="px-2 py-1 flex-1 appearance-none rounded-none rounded-r-md border outline-none border-gray-300 ring-inset ring-indigo-500 focus:ring-1 focus:border-indigo-500"
  />
</div>

<div class="flex rounded-md shadow mb-1">
  <span class="px-2 py-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">Height</span>
  <input
    type="number"
    placeholder="1"
    bind:value={$height}
    class="px-2 py-1 flex-1 appearance-none rounded-none rounded-r-md border outline-none border-gray-300 ring-inset ring-indigo-500 focus:ring-1 focus:border-indigo-500"
  />
</div>

<img src={new MediaFile(colorText(crop($images[0], $x, $y, $width, $height))).toURL()} alt="" />

{#each abc as ab}
  <img src={ab} alt="" />
{/each}
