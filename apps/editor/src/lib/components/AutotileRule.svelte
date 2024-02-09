<script lang="ts">
	import { getBase64TileTexture } from '$lib/pixi/utils';
	import { editorContext, textures } from '$lib/store';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { AutoTile, type Direction, type Rule } from '../pixi/autotile';

	export let rule: Rule;

	let tileRenderer: HTMLImageElement;
	let container: HTMLDivElement;

	let selectedSameDirections: Direction[] = AutoTile.directions(rule.sameMask);
	let selectedDifferentDirections: Direction[] = AutoTile.directions(rule.differentMask);

	function toggle(dir: Direction) {
		if (selectedSameDirections.includes(dir)) {
			selectedSameDirections = selectedSameDirections.filter((item) => item != dir);
			selectedDifferentDirections = [...selectedDifferentDirections, dir];
		} else if (selectedDifferentDirections.includes(dir)) {
			selectedDifferentDirections = selectedDifferentDirections.filter((item) => item != dir);
		} else {
			selectedSameDirections = [...selectedSameDirections, dir];
		}
	}

	$: {
		rule.sameMask = AutoTile.mask(selectedSameDirections);
		rule.differentMask = AutoTile.mask(selectedDifferentDirections);
	}

	async function onClick() {
		const value = get(editorContext.store).selectedTiles[0][0];

		if (typeof value === 'number') {
			const base64Image = await getBase64TileTexture(textures[value], 44, 44);
			tileRenderer.src = base64Image;
		}
	}

	async function init() {
		if (rule.tile != -1) {
			const base64Image = await getBase64TileTexture(textures[rule.tile], 44, 44);
			tileRenderer.src = base64Image;
		}
	}

	onMount(async () => {
		await init();
	});
</script>

<div class="flex justify-between">
	<div
		on:click={onClick}
		bind:this={container}
		class="w-11 h-11 bg-highlight1 rounded overflow-hidden"
	>
		<img class="w-full h-full" alt="" src="" bind:this={tileRenderer} />
	</div>

	<div class="w-fit grid gap-1 grid-cols-3 grid-rows-3">
		{#each { length: 8 } as _, i}
			<div
				on:click={() => toggle(i)}
				class="w-3 h-3 bg-highlight1 hover:bg-highlight2 [&:nth-child(4)]:col-span-2"
				class:!bg-accent2={selectedSameDirections.includes(i)}
				class:!bg-error2={selectedDifferentDirections.includes(i)}
			></div>
		{/each}
	</div>
</div>
