<script lang="ts">
	import { Client } from '../Client';

	const client = new Client();

	let value: string = '';

	function sendMessage() {
		client.message(value);
	}
</script>

<input bind:value type="text" />
<button on:click={sendMessage}>Enviar</button>
