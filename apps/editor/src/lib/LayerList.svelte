<script lang="ts">
	import { editorContext } from '$lib/store';
	import classNames from 'classnames';

	let value: string = '';

	const store = editorContext.store;
</script>

<div class="flex gap-2 mt-4">
	<input class="text-black" bind:value />
	<button on:click={() => editorContext.createLayer(value)}>Adicionar</button>
</div>

<ul>
	{#each $store.layers as layer}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<li
			class={classNames({
				'bg-green-900': $store.currentLayer === layer.name
			})}
			on:click={() => {
				editorContext.selectLayer(layer.name);
			}}
		>
			{layer.name}
		</li>
	{/each}
</ul>
