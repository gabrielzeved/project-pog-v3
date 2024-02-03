import { PacketType } from '@ppog/shared';
import type { Client } from './Client';
import PlayerInfoPacketEvent from './events/PlayerInfoPacketEvent';
import PlayerInfoUpdatePacketEvent from './events/PlayerInfoUpdatePacketEvent';

export class HandleData {
	onPacket(client: Client, evt: string, data: any): boolean {
		switch (evt) {
			case PacketType.PLAYER_INFO:
				PlayerInfoPacketEvent(client, data);
				break;
			case PacketType.PLAYER_INFO_UPDATE:
				PlayerInfoUpdatePacketEvent(client, data);
				break;
			default:
				return false;
		}

		return true;
	}
}
