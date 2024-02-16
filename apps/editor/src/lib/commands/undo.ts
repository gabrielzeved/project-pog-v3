import { editorContext, type Layer } from '$lib/store';
import { cloneDeep } from 'lodash';
import { writable } from 'svelte/store';

export interface HistoryNode {
	layers: Layer[];
}

const MAX_HISTORY_SIZE = 100;

const history = writable<HistoryNode[]>([]);

export function addState(layers: Layer[]) {
	history.update((state) => {
		const newHistory = [...state, { layers: cloneDeep(layers) }];
		newHistory.splice(0, Math.max(newHistory.length - MAX_HISTORY_SIZE));
		return newHistory;
	});
}

export function undo() {
	history.update((state) => {
		const lastNode = state.pop();

		if (!lastNode) return state;

		console.log(lastNode);

		editorContext.store.update((storeState) => {
			return {
				...storeState,
				layers: cloneDeep(lastNode.layers)
			};
		});

		return state;
	});
}

function KeyPress(e: KeyboardEvent) {
	if (e.keyCode == 90 && e.ctrlKey) {
		undo();
	}
}

document.addEventListener('keydown', KeyPress);
