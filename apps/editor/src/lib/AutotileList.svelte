<script lang="ts">
	import AutotileConfigurator from '$lib/components/AutotileConfigurator.svelte';
	import { getBase64TileTexture } from '$lib/pixi/utils';
	import { editorContext, initTextures, textures } from '$lib/store';
	import Panel from '$lib/ui/Panel.svelte';
	import { Codesandbox, Pencil, Plus, X } from 'lucide-svelte';
	import { onMount } from 'svelte';

	const store = editorContext.store;
	let tileTextures: string[] = [];

	async function loadTextures() {
		tileTextures = [];
		for (const autotile of $store.autotiles) {
			const texture = await getBase64TileTexture(textures[autotile.tile], 44, 44);
			tileTextures.push(texture);
		}
		tileTextures = [...tileTextures];
	}

	$: {
		loadTextures();
	}

	onMount(async () => {
		await initTextures();
		await loadTextures();
	});

	function onUpdate(idx: number, image: string) {
		tileTextures[idx] = image;
	}
</script>

<div class="p-4 rounded border border-elevation1 mt-4">
	<h3 class="text-lg mb-4 leading-none flex items-center gap-2 justify-center">
		<Codesandbox strokeWidth={1} />Autotiles
	</h3>

	<div class="flex items-center gap-2 flex-wrap">
		{#each $store.autotiles as autotile, idx}
			<div class="w-11 h-11 relative group">
				<button
					class="w-11 h-11 rounded bg-elevation1 overflow-hidden"
					on:click={() => {
						editorContext.setSelectedTiles([[autotile]]);
					}}
				>
					<img class="w-full h-full" alt="" src={tileTextures[idx]} />
				</button>

				<span
					on:click={() => {
						editorContext.deleteAutotile(autotile.tile);
						loadTextures();
					}}
					class="absolute cursos-pointer p-1 top-0 right-0 translate-x-1/4 -translate-y-1/4 rounded-full bg-error3 hover:bg-error2 grid place-items-center group-hover:opacity-100 opacity-0 transition-all duration-150"
				>
					<X size={12} strokeWidth={2} />
				</span>

				<Panel>
					<span
						slot="trigger"
						class="absolute p-1 top-0 left-0 -translate-x-1/4 -translate-y-1/4 rounded-full bg-accent3 hover:bg-accent2 grid place-items-center group-hover:opacity-100 opacity-0 transition-all duration-150"
					>
						<Pencil size={12} strokeWidth={2} />
					</span>

					<AutotileConfigurator
						on:defaultChange={(evt) => onUpdate(idx, evt.detail.tileImage)}
						bind:defaultTile={autotile.tile}
						bind:rules={autotile.rules}
					/>
				</Panel>
			</div>
		{/each}

		<button
			class="w-11 h-11 rounded border border-dashed border-accent1 hover:border-solid bg-elevation1 grid place-items-center"
			on:click={() => {
				editorContext.createAutotile();
				loadTextures();
			}}
		>
			<Plus />
		</button>
	</div>
</div>
