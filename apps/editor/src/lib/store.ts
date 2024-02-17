import { CELL_SIZE, MAP_SIZE } from '$lib/constants';
import { AutoTile, type Tile } from '$lib/pixi/autotile';
import type { Texture } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { get, writable } from 'svelte/store';

export type Tool = 'PENCIL' | 'BUCKET';

export interface Layer {
	id: number;
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
	selectedTool: Tool;
}

export function parseLayer(layer: Layer) {
	const data: number[] = [];

	for (let y = 0; y < MAP_SIZE; y++) {
		for (let x = 0; x < MAP_SIZE; x++) {
			const tile = layer.map[y * MAP_SIZE + x];

			if (tile != null) {
				if (tile instanceof AutoTile) {
					data[y * MAP_SIZE + x] = tile.determineTile(x, y, layer.map);
					continue;
				}

				data[y * MAP_SIZE + x] = tile ?? -1;
			}
		}
	}
	return data;
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
					name: 'Layer 1',
					id: 1
				}
			],
			selectedTool: 'PENCIL',
			autotiles: [],
			history: []
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

function isValid(x: number, y: number, tile: Tile, map: Tile[], visited: boolean[]) {
	if (x < 0 || x >= MAP_SIZE) return false;
	if (y < 0 || y >= MAP_SIZE) return false;
	if (map[y * MAP_SIZE + x] != tile || visited[y * MAP_SIZE + x]) return false;

	return true;
}

const editorContext = {
	store,
	setSelectedTiles(tiles: Tile[][]) {
		store.update((state) => ({ ...state, selectedTiles: tiles }));
	},

	export() {
		const value = get(store);

		const data = {
			height: MAP_SIZE,
			width: MAP_SIZE,
			tileHeight: CELL_SIZE,
			tileWidth: CELL_SIZE,
			layers: value.layers.map((layer) => {
				return {
					id: layer.id,
					data: parseLayer(layer),
					name: layer.name,
					visible: layer.visible,
					objects: [],
					properties: {}
				};
			}),
			tilesets: [
				{
					firstId: 0,
					image: '/spr_grass_tileset.png',
					name: '/spr_grass_tileset.png',
					objects: []
				}
			]
		};

		const fileName = 'map.json';

		const saveTemplateAsFile = (filename: string, dataObjToWrite: unknown) => {
			const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: 'text/json' });
			const link = document.createElement('a');

			link.download = filename;
			link.href = window.URL.createObjectURL(blob);
			link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');

			const evt = new MouseEvent('click', {
				view: window,
				bubbles: true,
				cancelable: true
			});

			link.dispatchEvent(evt);
			link.remove();
		};

		saveTemplateAsFile(fileName, data);
	},
	selectTool(tool: Tool) {
		store.update((state) => {
			return {
				...state,
				selectedTool: tool
			};
		});
	},

	floodFill(x: number, y: number, clear = false) {
		store.update((state) => {
			const deltaX = [1, -1, 0, 0];
			const deltaY = [0, 0, 1, -1];

			const visited: boolean[] = [];
			const queue: [number, number][] = [];
			queue.push([x, y]);

			const layerIndex = state.layers.findIndex((item) => item.name === state.currentLayer);
			const layer = state.layers[layerIndex];
			const layersCopy = [...state.layers];
			layersCopy[layerIndex] = {
				...layer
			};

			if (!layer) return state;

			const targetTile = layer.map[y * MAP_SIZE + x];

			while (queue.length > 0) {
				const current = queue.pop();

				if (!current) continue;

				layer.map[current[1] * MAP_SIZE + current[0]] = clear ? null : state.selectedTiles[0][0];

				// editorContext.addTile(current[0], current[1]);

				for (let i = 0; i <= 3; i++) {
					const nextX = current[0] + deltaX[i];
					const nextY = current[1] + deltaY[i];

					if (isValid(nextX, nextY, targetTile, layer.map, visited)) {
						visited[nextY * MAP_SIZE + nextX] = true;
						queue.push([nextX, nextY]);
					}
				}
			}

			return {
				...state,
				layers: layersCopy
			};
		});
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

			return {
				...state
			};
		});
	},
	removeTile(x: number, y: number) {
		if (x >= MAP_SIZE || y >= MAP_SIZE || x < 0 || y < 0) return;

		store.update((state) => {
			const layer = state.layers.find((item) => item.name === state.currentLayer);

			const index = y * MAP_SIZE + x;
			layer!.map[index] = null;

			return {
				...state
			};
		});
	},
	createLayer(name: string) {
		store.update((state) => {
			if (state.layers.some((layer) => layer.name === name)) return state;

			const highestId = state.layers.reduce((prev, curr) => (curr.id < prev ? prev : curr.id), 0);

			state.layers.unshift({
				editable: true,
				visible: true,
				map: new Array(MAP_SIZE * MAP_SIZE).fill(null),
				name,
				id: highestId + 1
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
	},
	deleteAutotile(tile: number) {
		store.update((state) => {
			return {
				...state,
				autotiles: state.autotiles.filter((autotile) => autotile.tile !== tile)
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
