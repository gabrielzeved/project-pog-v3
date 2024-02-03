import type { PlayerInfoPacket } from '@ppog/shared/packets/client/player/PlayerInfoPacket';
import type { Client } from '../Client';

export default function PlayerInfoPacketEvent(client: Client, packet: PlayerInfoPacket) {
	client.entityId = packet.data.entityId;
}
