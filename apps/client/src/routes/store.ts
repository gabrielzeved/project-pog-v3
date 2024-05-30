import { writable } from 'svelte/store';
import { gameApp } from '../main';
import { ChatMessage } from '@ppog/shared';

export enum AppStates {
	STATE_LOGIN = 0,
	STATE_REGISTER,
	STATE_CHARACTER_CREATION,
	STATE_PLAYING
}

export const appState = writable(AppStates.STATE_LOGIN);

export const chats = writable<ChatMessage[]>([]);

appState.subscribe((state) => {
	if (state === AppStates.STATE_PLAYING) {
		gameApp.init();
	}
});
