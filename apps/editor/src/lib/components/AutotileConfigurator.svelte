<script lang="ts">
	import AutotileRule from '$lib/components/AutotileRule.svelte';
	import { type Rule } from '$lib/pixi/autotile';
	import { getBase64TileTexture } from '$lib/pixi/utils';
	import { editorContext, textures } from '$lib/store';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	export let rules: Rule[] = [];
	let tileRenderer: HTMLImageElement;
	export let defaultTile: number;

	async function onClick() {
		const value = get(editorContext.store).selectedTiles[0][0];

		if (typeof value === 'number') {
			const base64Image = await getBase64TileTexture(textures[value], 44, 44);
			tileRenderer.src = base64Image;
			defaultTile = value;

			dispatch('defaultChange', {
				tileImage: base64Image
			});
		}
	}

	async function init() {
		if (defaultTile != -1) {
			const base64Image = await getBase64TileTexture(textures[defaultTile], 44, 44);
			tileRenderer.src = base64Image;
		}
	}

	onMount(async () => {
		await init();
	});

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col gap-2">
	<div class="flex gap-2 items-center justify-between">
		<span>Default</span>
		<div on:click={onClick} class="w-11 h-11 bg-highlight1 rounded">
			<img class="w-full h-full" alt="" src="" bind:this={tileRenderer} />
		</div>
	</div>

	<div class="h-[1px] w-full bg-elevation1"></div>

	<span>Rules</span>

	{#each rules as rule}
		<AutotileRule bind:rule />
	{/each}

	<button
		class="rounded-sm p-1 w-full bg-accent2 text-center text-xs text-highlight3 border-accent2 hover:border-accent3 border active:bg-accent1"
		on:click={() => {
			rules = [...rules, { sameMask: 0, differentMask: 0, tile: -1 }];
		}}
	>
		New rule
	</button>
</div>
