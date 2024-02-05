import { GameApp } from './GameApp';
import { Client } from './network/Client';

// Network
export const client = new Client();

// Game App
export const gameApp = new GameApp({
	view: document.getElementById('app') as HTMLCanvasElement,
	backgroundColor: 'yellow'
});
