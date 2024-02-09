import type { EntityDestroyPacket } from '@ppog/shared/packets/client/entities';
import type { Client } from '../Client';
import { gameApp } from '../../main';

export default function EntityDestroyPacketEvent(_client: Client, packet: EntityDestroyPacket) {
	gameApp.destroyEntity(packet.entityId);
}
