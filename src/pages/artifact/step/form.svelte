<script>
  import Dropdown from "@/icon/dropdown.svelte";
  export let second;
  export let select;
  export let error;
  export let noinput;
  export let update;
  let open = false;
  let ths;
</script>

<svelte:window
  on:click={(e) => {
    if (e.target == ths || ths.contains(e.target)) {
      open = !open;
    } else {
      open = false;
    }
  }}
/>

{#if !noinput}
  <div class="flex rounded-md shadow my-1">
    <button
      class={`flex relative rounded-l-md border ring-inset focus:outline-none w-1/3 ` +
        (error
          ? `border-gray-300 ring-indigo-500 focus:border-indigo-500 focus:ring-1 `
          : `border-red-500 ring-red-500 border-r-0 ring-1`)}
      bind:this={ths}
    >
      <p class="flex-1 px-2 py-1 ml-8">{second.name}</p>
      <Dropdown class="w-8 fill-current text-gray-400" />
      <div
        class="flex flex-col shadow bg-gray-50 absolute w-full mt-9 z-10"
        class:hidden={!open}
      >
        {#each select as option}
          <button
            class="py-2"
            on:click={() => {
              second.name = option;
              update(second);
            }}
          >
            {option}
          </button>
        {/each}
      </div>
    </button>
    <input
      class={`px-2 py-1 rounded-r-md border ring-inset focus:outline-none w-2/3 appearance-none rounded-none ` +
        (error
          ? `border-gray-300 ring-indigo-500 focus:border-indigo-500 focus:ring-1 `
          : `border-red-500 ring-red-500 border-l-0 ring-1`)}
      value={second.value}
      on:input={(e) => {
        second.value = e.target.value;
        update(second);
      }}
    />
  </div>
{:else}
  <button
    class={`flex rounded-md shadow w-1/3 my-1 relative border ring-inset focus:outline-none ` +
      (error
        ? `border-gray-300 ring-indigo-500 focus:border-indigo-500 focus:ring-1`
        : `border-red-500 ring-red-500 ring-1`)}
    bind:this={ths}
  >
    <p class="flex-1 px-2 py-1 ml-8">{second}</p>
    <Dropdown class="w-8 fill-current text-gray-400" />
    <div
      class="flex flex-col shadow bg-gray-50 absolute w-full mt-9 z-10"
      class:hidden={!open}
    >
      {#each select as option}
        <button
          class="py-2"
          on:click={() => {
            second = option;
            update(second);
          }}
        >
          {option}
        </button>
      {/each}
    </div>
  </button>
{/if}
