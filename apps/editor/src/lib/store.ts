import { MAP_SIZE } from '$lib/constants';
import { writable } from 'svelte/store';

export type Tools = 'PENCIL' | 'BUCKET';

export interface EditorStore {
	selectedTiles: (number | null)[][];
	map: (number | null)[];
}

const store = writable<EditorStore>({
	selectedTiles: [],
	map: new Array(MAP_SIZE * MAP_SIZE).fill(null)
});

const editorContext = {
	store,
	setSelectedTiles(tiles: (number | null)[][]) {
		store.update((state) => ({ ...state, selectedTiles: tiles }));
	},

	addTile(x: number, y: number) {
		if (x >= MAP_SIZE || y >= MAP_SIZE || x < 0 || y < 0) return;

		store.update((state) => {
			for (let cellX = 0; cellX < state.selectedTiles.length; cellX++) {
				const column = state.selectedTiles[cellX];
				for (let cellY = 0; cellY < column.length; cellY++) {
					const index = (y + cellY) * MAP_SIZE + (x + cellX);

					state.map[index] = state.selectedTiles[cellX][cellY];
				}
			}
			return {
				...state
			};
		});
	}
};

export { editorContext };
