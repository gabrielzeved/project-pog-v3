import type { EntityMovePacket } from '@ppog/shared/packets/client/entities/EntityMovePacket';
import { gameApp } from '../../main';
import type { Client } from '../Client';

export default function EntityMovePacketEvent(_client: Client, packet: EntityMovePacket) {
	const entity = gameApp.getEntity(packet.data.id);

	console.log(packet);

	if (!entity) return;

	entity.setPosition(packet.data.to[0], packet.data.to[1]);
}
