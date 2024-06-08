import { GameApp } from './GameApp';
// Game App
export const gameApp = new GameApp({
	view: document.getElementById('app') as HTMLCanvasElement,
	backgroundColor: '#000',
	resolution: 1
});
