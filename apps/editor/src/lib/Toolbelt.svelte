<script lang="ts">
	import { editorContext } from '$lib/store';
	import classNames from 'classnames';
	import { PaintBucket, Pencil } from 'lucide-svelte';

	const store = editorContext.store;
</script>

<div class="flex items-center gap-4">
	<div
		class={classNames('hover:outline-dashed outline-accent1 outline-1 p-2 rounded cursor-pointer', {
			outline: $store.selectedTool == 'PENCIL'
		})}
		on:click={() => {
			editorContext.selectTool('PENCIL');
		}}
	>
		<Pencil size={16} />
	</div>
	<div
		class={classNames('hover:outline-dashed outline-accent1 outline-1 p-2 rounded cursor-pointer', {
			outline: $store.selectedTool === 'BUCKET'
		})}
		on:click={() => {
			editorContext.selectTool('BUCKET');
		}}
	>
		<PaintBucket size={16} />
	</div>
</div>
