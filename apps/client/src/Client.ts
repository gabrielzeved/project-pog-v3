import { ChatMessagePacket, Packet } from '@ppog/shared';
import { io, type Socket } from 'socket.io-client';
export class Client {
	socket!: Socket;

	constructor() {
		this.setup();
	}

	setup() {
		this.socket = this.socket = io('ws://localhost:3000', {
			transports: ['websocket']
		});
	}

	sendChatMessage(message: string) {
		const packet = new ChatMessagePacket(message);
		this.sendPacket(packet);
	}

	sendPacket(packet: Packet) {
		this.socket.emit(packet.name, packet);
	}
}
