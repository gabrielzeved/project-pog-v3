<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface $$Props extends HTMLButtonAttributes {}
</script>

<button
	{...$$restProps}
	class="px-2 py-1 shadow-default inline-flex w-fit items-center gap-2 bg-elevation3 hover:bg-highlight1"
>
	<slot />
</button>
