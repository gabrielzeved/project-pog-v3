import { Packet, ServerPackets } from '@ppog/shared';
import { io, type Socket } from 'socket.io-client';
import { HandleData } from './HandleData';

export class Client {
	socket!: Socket;
	entityId: string = '';
	dataHandler: HandleData = new HandleData();

	constructor() {
		this.setup();
	}

	setup() {
		this.socket = this.socket = io('ws://26.255.119.133:3000', {
			transports: ['websocket']
		});
		this.socket.onAny((evt, data) => {
			try {
				if (!this.onMessage(evt, data)) {
					console.log('Unknown command (' + evt + '), disconnected.');
					// this.socket.disconnect();
				}
			} catch (err) {
				console.error(err);
			}
		});
	}

	onMessage(evt: string, data: any): boolean {
		return this.dataHandler.onPacket(this, evt, data);
	}

	sendChatMessage(message: string) {
		const packet = new ServerPackets.ChatMessagePacket(message);
		this.sendPacket(packet);
	}

	sendPacket(packet: Packet) {
		this.socket.emit(packet.name, packet);
	}
}
