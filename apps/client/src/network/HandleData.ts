import { PacketType } from '@ppog/shared';
import type { Client } from './Client';
import ChatMessagePacketEvent from './events/ChatMessagePacketEvent';
import EntityDestroyPacketEvent from './events/EntityDestroyPacketEvent';
import EntityMovePacketEvent from './events/EntityMovePacketEvent';
import EntitySpawnPacketEvent from './events/EntitySpawnPacketEvent';
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
			case PacketType.CHAT_MESSAGE:
				ChatMessagePacketEvent(client, data);
				break;
			case PacketType.ENTITY_SPAWN:
				EntitySpawnPacketEvent(client, data);
				break;
			case PacketType.ENTITY_DESTROY:
				EntityDestroyPacketEvent(client, data);
				break;
			case PacketType.ENTITY_MOVE:
				EntityMovePacketEvent(client, data);
				break;
			default:
				return false;
		}

		return true;
	}
}
