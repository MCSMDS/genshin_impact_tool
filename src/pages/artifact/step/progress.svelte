<script>
  import { myprogress } from "@/systen/StoreSystem";
</script>

<div class="flex flex-col justify-center space-x-4 h-full">
  <div class="w-full h-6 bg-gray-400 rounded-xl overflow-hidden">
    <div
      class="h-full bg-blue-500 rounded-xl"
      style={`width:${$myprogress}%`}
    />
  </div>
  <p class="mt-1 text-right">{$myprogress.toFixed(1)}%</p>
</div>
