import type { EntitySpawnPacket } from '@ppog/shared/packets/client/entities';
import { PlayerEntity } from '../../entities/PlayerEntity';
import { gameApp } from '../../main';
import type { Client } from '../Client';

export default function EntitySpawnPacketEvent(_client: Client, packet: EntitySpawnPacket) {
	const player = new PlayerEntity(packet.data.id, packet.data.name, packet.data.spritePath);
	player.setPosition(packet.data.position[0], packet.data.position[1]);
	player.zOrder = 5;
	gameApp.addEntity(player);
}
