import { drawLayers, initTextures } from '../../engine/tilemap/Tilemap';
import { gameApp } from '../../main';
import type { Client } from '../Client';
import type { WorldLoadPacket } from '@ppog/shared/packets/client/world';

export default async function WorldLoadPacketEvent(_client: Client, packet: WorldLoadPacket) {
	gameApp.worldMap = packet.data;

	await initTextures(gameApp.worldMap);
	await drawLayers(gameApp.worldMap.layers);
}
