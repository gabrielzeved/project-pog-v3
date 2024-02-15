<script lang="ts">
	import Preview from '$lib/Preview.svelte';
	import TileSelector from '$lib/TileSelector.svelte';

	import AutotileList from '$lib/AutotileList.svelte';
	import LayerList from '$lib/LayerList.svelte';
	import { editorContext } from '$lib/store';
	import Toolbelt from '$lib/Toolbelt.svelte';
</script>

<div class="flex min-h-screen h-full min-w-screen font-mono text-xs">
	<div class="flex flex-col p-4 h-screen bg-elevation2 text-highlight3">
		<h1 class="text-3xl">Editor</h1>

		<div class="p-[2px] mt-4">
			<TileSelector />
		</div>

		<button
			class="rounded-sm p-1 w-full bg-accent2 text-center text-xs text-highlight3 border-accent2 hover:border-accent3 border active:bg-accent1"
			on:click={() => editorContext.export()}
		>
			Exportar
		</button>

		<AutotileList />

		<LayerList />
	</div>

	<div class="flex flex-col w-full">
		<div class="flex p-4 h-12 bg-elevation2 text-highlight3">
			<Toolbelt />
		</div>
		<Preview />
	</div>
</div>
