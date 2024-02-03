<script lang="ts">
	import { client, gameApp } from '../main';

	const clients = gameApp.connectedClients;

	let value: string = '';

	function sendMessage() {
		client.sendChatMessage(value);
	}
</script>

<div>
	<p>Connected clients:</p>
	<p>
		{$clients}
	</p>
</div>

<label for="message">Send message</label>
<input name="message" bind:value type="text" />
<button on:click={sendMessage}>Enviar</button>
