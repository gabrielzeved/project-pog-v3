<script lang="ts">
	import Preview from '$lib/Preview.svelte';
	import TileSelector from '$lib/TileSelector.svelte';
	import Button from '$lib/ui/Button.svelte';
</script>

<div class="flex min-h-screen h-full min-w-screen">
	<div class="flex flex-col p-4 h-screen bg-elevation2 text-highlight3 shadow-default">
		<h1 class="text-3xl">Editor</h1>

		<div class="p-[2px] shadow-default my-4">
			<TileSelector />
		</div>

		<Button />
	</div>

	<Preview />
</div>
