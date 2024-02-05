import type { EntitySpawnPacket } from '@ppog/shared/packets/client/entities';
import type { Client } from '../Client';
import { gameApp } from '../../main';
import { GameEntity } from '../../entities/GameEntity';

export default function EntitySpawnPacketEvent(_client: Client, packet: EntitySpawnPacket) {
	gameApp.addEntity(
		new GameEntity(packet.entity.id, packet.entity.position, packet.entity.spritePath)
	);
}
