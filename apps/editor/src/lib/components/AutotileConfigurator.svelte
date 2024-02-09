<script lang="ts">
	import AutotileRule from '$lib/components/AutotileRule.svelte';
	import { type Rule } from '$lib/pixi/autotile';
	export let rules: Rule[] = [];
</script>

<div class="flex flex-col gap-2">
	<div class="flex gap-2 items-center justify-between">
		<span>Default</span>
		<div class="w-11 h-11 bg-highlight1 rounded"></div>
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
