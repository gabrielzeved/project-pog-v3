<script lang="ts">
	import Preview from '$lib/Preview.svelte';
	import TileSelector from '$lib/TileSelector.svelte';

	import AutotileList from '$lib/AutotileList.svelte';
	import LayerList from '$lib/LayerList.svelte';
</script>

<div class="flex min-h-screen h-full min-w-screen font-mono text-xs">
	<div class="flex flex-col p-4 h-screen bg-elevation2 text-highlight3">
		<h1 class="text-3xl">Editor</h1>

		<div class="p-[2px] mt-4">
			<TileSelector />
		</div>

		<AutotileList />

		<LayerList />
	</div>

	<div class="flex flex-col w-full">
		<div class="flex p-4 h-12 bg-elevation2 text-highlight3"></div>
		<Preview />
	</div>
</div>
