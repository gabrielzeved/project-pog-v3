import { CELL_SIZE, MAP_SIZE } from '$lib/constants';
import { AutoTile, type Tile } from '$lib/pixi/autotile';
import type { Texture } from 'pixi.js';
import { writable } from 'svelte/store';

import * as PIXI from 'pixi.js';

export type Tools = 'PENCIL' | 'BUCKET';

export interface Layer {
	name: string;
	visible: boolean;
	editable: boolean;
	map: Tile[];
}

export interface EditorStore {
	selectedTiles: Tile[][];
	currentLayer: string;
	layers: Layer[];
	autotiles: AutoTile[];
}

const storagedState = localStorage.getItem('pog.editor');

const initialValue = storagedState
	? (JSON.parse(storagedState) as EditorStore)
	: ({
			selectedTiles: [[]],
			currentLayer: 'Layer 1',
			layers: [
				{
					editable: true,
					visible: true,
					map: new Array(MAP_SIZE * MAP_SIZE).fill(null),
					name: 'Layer 1'
				}
			],
			autotiles: []
		} as EditorStore);

initialValue.autotiles = initialValue.autotiles.map((obj) =>
	Object.setPrototypeOf(obj, AutoTile.prototype)
);

initialValue.layers.forEach((layer) => {
	layer.map.map((tile) => {
		if (typeof tile === 'number') return tile;
		if (tile === null) return tile;

		return Object.setPrototypeOf(tile, AutoTile.prototype);
	});
});

const store = writable<EditorStore>(initialValue);

store.subscribe((state) => {
	localStorage.setItem('pog.editor', JSON.stringify(state));
});

const editorContext = {
	store,
	setSelectedTiles(tiles: Tile[][]) {
		store.update((state) => ({ ...state, selectedTiles: tiles }));
	},

	addTile(x: number, y: number) {
		if (x >= MAP_SIZE || y >= MAP_SIZE || x < 0 || y < 0) return;

		store.update((state) => {
			const layer = state.layers.find((item) => item.name === state.currentLayer);

			for (let cellX = 0; cellX < state.selectedTiles.length; cellX++) {
				const column = state.selectedTiles[cellX];
				for (let cellY = 0; cellY < column.length; cellY++) {
					const index = (y + cellY) * MAP_SIZE + (x + cellX);

					layer!.map[index] = state.selectedTiles[cellX][cellY];
				}
			}

			const newSelectedTiles = state.selectedTiles.map(function (arr) {
				return arr.slice();
			});

			return {
				...state,
				selectedTiles: newSelectedTiles
			};
		});
	},
	createLayer(name: string) {
		store.update((state) => {
			if (state.layers.some((layer) => layer.name === name)) return state;

			state.layers.unshift({
				editable: true,
				visible: true,
				map: new Array(MAP_SIZE * MAP_SIZE).fill(null),
				name
			});
			return {
				...state
			};
		});
	},
	selectLayer(name: string) {
		store.update((state) => {
			return {
				...state,
				currentLayer: name
			};
		});
	},
	toggleLayer(name: string) {
		store.update((state) => {
			const layers = state.layers;
			const idx = state.layers.findIndex((layer) => layer.name === name);

			if (idx === -1) return state;

			layers[idx].visible = !layers[idx].visible;

			return {
				...state,
				layers: [...layers]
			};
		});
	},
	deleteLayer(name: string) {
		store.update((state) => {
			return {
				...state,
				layers: state.layers.filter((layer) => layer.name != name)
			};
		});
	},
	createAutotile() {
		const newAutotile = new AutoTile();

		store.update((state) => {
			return {
				...state,
				autotiles: [...state.autotiles, newAutotile]
			};
		});
	}
};

export { editorContext };

export const textures: Texture[] = [];
export let textureRows: number;
export let textureCols: number;
export let asset: PIXI.Texture;

export async function initTextures() {
	if (textures.length != 0) return;

	asset = await PIXI.Assets.load('/spr_grass_tileset.png');
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
