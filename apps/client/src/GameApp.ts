import { writable } from 'svelte/store';

export class GameApp {
	public connectedClients = writable<string[]>([]);
}
