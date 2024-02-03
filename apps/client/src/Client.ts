import { ChatMessagePacket } from '@ppog/shared';
import { io, type Socket } from 'socket.io-client';

export class Client {
	socket!: Socket;

	constructor() {
		this.setup();
	}

	setup() {
		this.socket = this.socket = io('ws://26.255.119.133:3000', {
			transports: ['websocket']
		});
	}

	message() {
		const packet = new ChatMessagePacket('teste', 'testando');

		this.socket.emit(packet.name, packet);
	}
}
