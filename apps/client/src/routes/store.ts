import { writable } from 'svelte/store';

export enum AppStates {
	STATE_LOGIN = 0,
	STATE_REGISTER,
	STATE_PLAYING
}

export const appState = writable(AppStates.STATE_LOGIN);
