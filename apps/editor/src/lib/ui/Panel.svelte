<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte';
	import { GripHorizontal, XCircle } from 'lucide-svelte';
	import MoveableComponent from 'svelte-moveable';
	const {
		elements: { trigger, portalled, overlay, content, close },
		states: { open }
	} = createDialog({
		closeOnOutsideClick: false,
		preventScroll: false
	});
	let target: HTMLDivElement;
	let dragTarget: HTMLElement;
</script>

<button use:melt={$trigger}>
	<slot name="trigger" />
</button>

<div class="absolute inset-0 z-10 pointer-events-none" use:melt={$portalled}>
	{#if $open}
		<div class="w-screen h-screen relative" use:melt={$overlay}>
			<div
				class="min-w-52 rounded-lg bg-elevation1 pointer-events-all absolute top-10 left-10 pointer-events-auto text-highlight1"
				use:melt={$content}
				bind:this={target}
			>
				<div class="flex justify-between px-4 py-2 items-center">
					<span />

					<span bind:this={dragTarget}>
						<GripHorizontal class="hover:text-highlight2 cursor-grab active:cursor-grabbing" />
						<MoveableComponent
							{target}
							{dragTarget}
							hideDefaultLines
							draggable={true}
							throttleDrag={1}
							edgeDraggable={false}
							edge={false}
							origin={false}
							startDragRotate={0}
							throttleDragRotate={0}
							onDrag={(e) => {
								e.target.style.transform = e.transform;
							}}
						/>
					</span>

					<span use:melt={$close}>
						<XCircle class="hover:text-highlight2 cursor-pointer" size={16} />
					</span>
				</div>

				<div class="rounded-lg bg-elevation2 p-4 text-xs">
					<slot />
				</div>
			</div>
		</div>
	{/if}
</div>
