import type { EntitySpawnPacket } from '@ppog/shared/packets/client/entities';
import type { Client } from '../Client';
import { gameApp } from '../../main';
import { PlayerEntity } from '../../entities/PlayerEntity';

export default function EntitySpawnPacketEvent(_client: Client, packet: EntitySpawnPacket) {
	const player = new PlayerEntity(packet.data.name, packet.data.spritePath);
	player.id = packet.data.id;
	player.setPosition(packet.data.position.x, packet.data.position.y);

	gameApp.addEntity(player);
}
