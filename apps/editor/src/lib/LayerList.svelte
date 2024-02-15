<script lang="ts">
	import { editorContext } from '$lib/store';
	import classNames from 'classnames';
	import { Eye, EyeOff, Layers, Trash2 } from 'lucide-svelte';

	let value: string = '';

	const store = editorContext.store;
</script>

<div class="p-4 rounded border border-elevation1 mt-4">
	<h3 class="text-lg mb-4 leading-none flex items-center gap-2 justify-center">
		<Layers strokeWidth={1} />Layers
	</h3>

	<div class="flex gap-2">
		<input
			class="rounded px-2 py-1 justify-between border border-elevation1 hover:border-accent1 focus-within:border focus-within:outline-none focus-within:border-accent1 bg-elevation1"
			bind:value
		/>
		<button
			class="rounded-sm p-1 w-full bg-accent2 text-center text-xs text-highlight3 border-accent2 hover:border-accent3 border active:bg-accent1"
			on:click={() => editorContext.createLayer(value)}
		>
			Novo layer
		</button>
	</div>

	<ul class="text-xs mt-2 flex flex-col gap-2">
		{#each $store.layers as layer}
			<li
				class={classNames(
					'rounded px-2 py-1 flex items-center justify-between border border-elevation1 hover:border-accent1 cursor-pointer',
					{
						'bg-elevation1': $store.currentLayer === layer.name
					}
				)}
				on:click={() => {
					editorContext.selectLayer(layer.name);
				}}
			>
				{layer.name}
				<div class="flex items-center gap-2">
					<span
						class="cursor-pointer hover:text-highlight3 text-highlight2"
						on:click={() => {
							editorContext.toggleLayer(layer.name);
						}}
					>
						{#if layer.visible}
							<Eye size={16} />
						{:else}
							<EyeOff size={16} />
						{/if}
					</span>

					<span
						class="cursor-pointer hover:text-highlight3 text-highlight2"
						on:click={() => {
							editorContext.deleteLayer(layer.name);
						}}
					>
						<Trash2 size={16} />
					</span>
				</div>
			</li>
		{/each}
	</ul>
</div>
