import type { PlayerInfoUpdatePacket } from '@ppog/shared/packets/client/player';
import type { Client } from '../Client';
import { gameApp } from '../../main';

export default function PlayerInfoUpdatePacketEvent(
	_client: Client,
	packet: PlayerInfoUpdatePacket
) {
	gameApp.connectedClients.set(packet.data.clients);
}
