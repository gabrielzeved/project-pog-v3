<script lang="ts">
	import { Client } from '../Client';

	const client = new Client();

	let value: string = '';

	let clients: string[] = [];

	function sendMessage() {
		client.sendChatMessage(value);
	}
</script>

{clients}

<input bind:value type="text" />
<button on:click={sendMessage}>Enviar</button>
