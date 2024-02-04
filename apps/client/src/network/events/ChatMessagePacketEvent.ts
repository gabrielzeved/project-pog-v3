import type { Client } from '../Client';
import type { ChatMessagePacket } from '@ppog/shared/packets/client/chat';

export default function ChatMessagePacketEvent(client: Client, packet: ChatMessagePacket) {
	console.log(packet.message);
}
