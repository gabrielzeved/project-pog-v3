<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { gameApp } from '../../main';
	import { chats } from '../../routes/store';

	let messagesContainer: HTMLDivElement;
	let myText = '';

	function sendMessage() {
		if (myText.trim() !== '') {
			gameApp.chatManager.sendChat(myText);
			myText = '';
		}
	}

	function onKeyUp(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			sendMessage();
		}
	}

	afterUpdate(() => {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	});
</script>

<div class="flex flex-col p-3 fixed bottom-0 left-0 w-3/12 h-60 bg-gray-800 bg-opacity-5">
	<div class="overflow-y-auto flex-grow" bind:this={messagesContainer}>
		{#each $chats as { sender, message }}
			<div class="mb-1">
				<strong>{sender}:</strong>
				{message}
			</div>
		{/each}
	</div>
	<div class="flex flex-row mt-auto">
		<input
			class="w-full outline-none p-1 text-xs opacity-55 hover:opacity-100 focus:opacity-100"
			bind:value={myText}
			on:keyup={onKeyUp}
			type="text"
		/>
	</div>
</div>
