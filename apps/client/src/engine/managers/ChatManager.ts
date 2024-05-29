import { ChatMessage, ChatRoomState } from '@ppog/shared';
import type { Client, Room } from 'colyseus.js';
import { writable } from 'svelte/store';
import { chats } from '../../routes/store';

export class ChatManager {
	private chatRoom: Room<ChatRoomState> = null;

	constructor(private client: Client) {
		this.joinChatRoom();
	}

	private async joinChatRoom() {
		this.chatRoom = await this.client.joinOrCreate<ChatRoomState>('chat_room');
		this.setupRoomHandlers();
	}

	private setupRoomHandlers(): void {
		this.chatRoom.state.chatMessages.onAdd((item, key) => this.handleChatMessageAdd(item, key));
		this.chatRoom.state.chatMessages.onRemove((item, key) =>
			this.handleChatMessageRemove(item, key)
		);
	}

	private handleChatMessageAdd(item: ChatMessage, key: number) {
		chats.update((state) => {
			const newChat = [...state, item];
			return newChat;
		});
	}

	private handleChatMessageRemove(item: ChatMessage, key: number) {
		chats.update((state) => {
			const newChat = [...state];
			const index = newChat.findIndex((chat) => chat.sender === item.sender);
			if (index !== -1) {
				newChat.splice(index, 1);
			}
			return newChat;
		});
	}

	public sendChat(message: string) {
		this.chatRoom?.send('sendChat', {
			message
		});
	}
}
