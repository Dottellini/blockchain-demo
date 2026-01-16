<script lang="ts">
  import Block from '$lib/Block.svelte';

  type BlockData = { id: number; nonce: number; data: string; hash: string; };

  let blocks: BlockData[] = [{ id: 1, nonce: 302634, data: "Genesis Block", hash: "000000fae2d148330086582a55b5f36dcda0ff84330143953a7833aa1e44dc9d" }];
  let blockHashes: Record<number, string> = {};
  let difficulty = 5; 
  const MAX_TARGET = 2n ** 256n - 1n;

  $: target = MAX_TARGET >> BigInt(difficulty * 4); 
  $: targetHex = target.toString(16).padStart(64, '0');
  
  let genesisPrevHash = "0000000000000000000000000000000000000000000000000000000000000000";

  function handleHashUpdate({ id, hash }: { id: number, hash: string }) {
    blockHashes = { ...blockHashes, [id]: hash };
  }

 function getPrevHash(index: number, _hashes: Record<number, string>) {
    if (index === 0) return genesisPrevHash;
    return blockHashes[blocks[index - 1].id] || "";
  }

  function addBlock() {
    blocks = [...blocks, { id: blocks.length + 1, nonce: 0, data: "", hash: "" }];
  }
</script>

<main class="min-h-screen bg-base-200 p-8 flex flex-col font-sans">
  <div class="navbar bg-base-100 rounded-box shadow-lg mb-8">
    <div class="flex-1">
      <div class="px-4">
        <h1 class="text-2xl font-bold">Blockchain Demo</h1>
        <p class="text-xs text-base-content/60 font-mono mt-1">Rule: Hash &lt; Target</p>
      </div>
    </div>
    <div class="flex-none">
      <button on:click={addBlock} class="btn btn-primary btn-sm gap-2">
        <span>+</span> New Block
      </button>
    </div>
  </div>

  <div class="card bg-base-100 shadow-xl mb-10 border border-base-300">
    <div class="card-body py-4">
      <h2 class="card-title text-sm uppercase tracking-wider text-base-content/50">Mining Difficulty</h2>
      
      <div class="flex flex-col md:flex-row gap-8 items-center mt-2">
        <div class="form-control w-full max-w-xs">
          <label class="label" for="diff">
            <span class="label-text font-bold">Difficulty: {difficulty}</span>
          </label>
          <input id="diff" type="range" min="1" max="10" bind:value={difficulty} class="range range-primary range-sm" step="1" />
          <div class="w-full flex justify-between text-xs px-2 mt-1 opacity-50">
            <span>Easy</span>
            <span>Hard</span>
          </div>
        </div>

        <div class="flex-1 w-full overflow-hidden">
          <div class="label-text text-xs mb-1">Current Target Value:</div>
          <div class="bg-base-300 text-base-content p-3 min-w-0">
            <pre class="text-xs"><code>{targetHex}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="flex-1 overflow-x-auto pb-10">
    <div class="flex items-start gap-4 min-w-max px-2">
      {#each blocks as block, index}
        <div class="flex items-center">
          <Block 
            id={block.id}
            bind:nonce={block.nonce}
            bind:data={block.data}
            prevHash={getPrevHash(index, blockHashes)}
            onHashChange={handleHashUpdate}
            target={target} 
          />
          {#if index < blocks.length - 1}
            <div class="text-4xl text-base-content/30 mx-4">
               ➔
             </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  <p>Inspired by <a href="https://github.com/anders94/blockchain-demo">Anders Brownworth</a></p>
</main>