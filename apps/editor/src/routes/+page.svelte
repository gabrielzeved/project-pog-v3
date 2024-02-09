<script lang="ts">
	import Preview from '$lib/Preview.svelte';
	import TileSelector from '$lib/TileSelector.svelte';
	import Button from '$lib/ui/Button.svelte';

	import LayerList from '$lib/LayerList.svelte';
	import AutotileConfigurator from '$lib/components/AutotileConfigurator.svelte';
	import { editorContext } from '$lib/store';
	import Panel from '$lib/ui/Panel.svelte';

	const store = editorContext.store;
</script>

<div class="flex min-h-screen h-full min-w-screen font-mono text-xs">
	<div class="flex flex-col p-4 h-screen bg-elevation2 text-highlight3">
		<h1 class="text-3xl">Editor</h1>

		<div class="p-[2px] my-4">
			<TileSelector />
		</div>

		<button
			on:click={() => {
				editorContext.createAutotile();
				console.log($store.autotiles);
			}}
		>
			Novo autotile
		</button>

		{#each $store.autotiles as autotile}
			<button
				on:click={() => {
					console.log(autotile);
					editorContext.setSelectedTiles([[autotile]]);
				}}
			>
				Selecionar
			</button>

			<Panel>
				<span slot="trigger">Abrir</span>
				<AutotileConfigurator bind:rules={autotile.rules} />
			</Panel>
		{/each}

		<Button>
			<img alt="" src="./imageIcon.svg" />
			Import asset
		</Button>

		<LayerList />
	</div>

	<div class="flex flex-col w-full">
		<div class="flex p-4 h-12 bg-elevation2 text-highlight3"></div>

		<Preview />
	</div>
</div>
