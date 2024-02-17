import type { Layer, WorldData } from '@ppog/shared';
import * as PIXI from 'pixi.js';
import { Tilemap } from '@pixi/tilemap';
import { gameApp } from '../../main';
import { CELL_SIZE, MAP_SIZE } from '$lib/constants';

export const textures: PIXI.Texture[] = [];
export let textureRows: number;
export let textureCols: number;
export let asset: PIXI.Texture;
export let tilemaps: Map<string, Tilemap> = new Map();

export async function initTextures(worldMap: WorldData) {
	if (textures.length != 0) return;

	asset = await PIXI.Assets.load(worldMap.tilesets[0].image);
	asset.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

	const rows = asset.height / CELL_SIZE;
	const columns = asset.width / CELL_SIZE;

	textureRows = rows;
	textureCols = columns;

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < columns; col++) {
			const tileTexture = new PIXI.Texture(
				asset.baseTexture,
				new PIXI.Rectangle(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
			);
			textures.push(tileTexture);
		}
	}
}

export async function drawLayers(layersList: Layer[] = []) {
	if (!asset) return;

	for (const [layerIndex, layer] of layersList.reverse().entries()) {
		if (tilemaps.has(layer.name)) continue;

		const layerContainer = new PIXI.Graphics();
		layerContainer.name = layer.name;
		layerContainer.parentLayer = gameApp.layerManager.get('root');
		layerContainer.zOrder = layerIndex;

		const tilemap = new Tilemap([asset.baseTexture]);

		tilemaps.set(layer.name, tilemap);

		layerContainer.addChild(tilemap);

		gameApp.drawTilemap(layerContainer);
	}

	for (const [key, tilemap] of tilemaps.entries()) {
		tilemap.clear();

		const layer = gameApp.worldMap.layers.find((layer) => layer.name === key);

		if (!layer) continue;
		if (!layer.visible) continue;

		for (let y = 0; y < MAP_SIZE; y++) {
			for (let x = 0; x < MAP_SIZE; x++) {
				const tile = layer.data[y * MAP_SIZE + x];

				if (tile != null) {
					// if (tile instanceof AutoTile) {
					// 	tilemap.tile(
					// 		textures[`${tile.determineTile(x, y, layer.map)}`],
					// 		x * CELL_SIZE,
					// 		y * CELL_SIZE
					// 	);
					// 	continue;
					// }

					tilemap.tile(textures[`${tile}`], x * CELL_SIZE, y * CELL_SIZE);
				}
			}
		}
	}
}
