import { MAP_SIZE } from '$lib/constants';
import { writable } from 'svelte/store';

export type Tools = 'PENCIL' | 'BUCKET';

export interface Layer {
	name: string;
	visible: boolean;
	editable: boolean;
	map: (number | null)[];
}

export interface EditorStore {
	selectedTiles: (number | null)[][];
	currentLayer: string;
	layers: Layer[];
}

const store = writable<EditorStore>({
	selectedTiles: [],
	currentLayer: 'Layer 1',
	layers: [
		{
			editable: true,
			visible: true,
			map: new Array(MAP_SIZE * MAP_SIZE).fill(null),
			name: 'Layer 1'
		}
	]
});

const editorContext = {
	store,
	setSelectedTiles(tiles: (number | null)[][]) {
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
			return {
				...state
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
	}
};

export { editorContext };
