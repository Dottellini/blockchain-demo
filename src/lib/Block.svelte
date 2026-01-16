<script lang="ts">
  import { sha256 } from 'js-sha256';

  export let id: number;
  export let nonce: number = 0;
  export let data: string = "";
  export let prevHash: string = "";
  export let target: bigint; 
  export let onHashChange: (detail: { id: number, hash: string }) => void = () => {};

  $: hash = sha256(id + nonce + data + prevHash);
  $: hashInt = BigInt('0x' + hash);
  $: isValid = hashInt <= target;
  $: onHashChange({ id, hash });

  function mine() {
    let currentHash = sha256(id + nonce + data + prevHash);
    let currentInt = BigInt('0x' + currentHash);
    while (currentInt > target) {
      nonce++;
      currentHash = sha256(id + nonce + data + prevHash);
      currentInt = BigInt('0x' + currentHash);
    }
  }
</script>

<div class="card w-80 bg-base-100 shadow-2xl transition-all duration-300 border-2 {isValid ? 'border-success' : 'border-error'}">
  <div class="card-body p-5">
    
    <div class="flex justify-between items-center mb-2">
      <h2 class="card-title text-lg">Block #{id}</h2>
      <div class="badge {isValid ? 'badge-success' : 'badge-error'} gap-2 font-bold text-white">
        {isValid ? 'VALID' : 'INVALID'}
      </div>
    </div>

    <div class="form-control w-full">
      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label class="label">
        <span class="label-text text-xs uppercase font-bold text-base-content/60">Nonce</span>
      </label>
      <input type="number" bind:value={nonce} class="input input-bordered input-sm font-mono w-full" />
    </div>

    <div class="form-control w-full">
      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label class="label">
        <span class="label-text text-xs uppercase font-bold text-base-content/60">Data</span>
      </label>
      <textarea bind:value={data} class="textarea textarea-bordered h-24 font-mono text-sm leading-tight" placeholder="Transaktionsdaten..."></textarea>
    </div>

    <div class="form-control w-full">
      <div class="label pb-0">
        <span class="label-text text-xs uppercase font-bold text-base-content/60">Prev Hash</span>
      </div>
      <div class="text-[10px] font-mono break-all bg-base-200 p-2 rounded text-base-content/70">
        {prevHash}
      </div>
    </div>

    <div class="form-control w-full">
      <div class="label pb-0">
        <span class="label-text text-xs uppercase font-bold text-base-content/60">Hash</span>
      </div>
      <div class="text-[10px] font-mono break-all bg-base-200 p-2 rounded font-bold {isValid ? 'text-success' : 'text-error'}">
        {hash}
      </div>
    </div>

    <div class="card-actions justify-end mt-4">
      <button 
        on:click={mine} 
        disabled={isValid} 
        class="btn btn-sm w-full {isValid ? 'btn-success text-white' : 'btn-primary'}"
      >
        {#if isValid}
          Valid
        {:else}
          Start Mining
        {/if}
      </button>
    </div>
  </div>
</div>