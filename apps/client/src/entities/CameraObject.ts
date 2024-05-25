import { gameApp } from '../main';
import { GameEntity } from './GameEntity';

export default class CameraObject extends GameEntity {
	constructor(
		name: string,
		private target: GameEntity,
		private zoomLevel: number = 1,
		private ease: number = 1
	) {
		super(name);
		this.target = target;
		this.zoomLevel = zoomLevel;
		this.ease = ease;
	}

	update(dt: number) {
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		const cameraX = this.target.x * this.zoomLevel - screenWidth / 2;
		const cameraY = this.target.y * this.zoomLevel - screenHeight / 2;

		// console.log(cameraX, 'test');
		// console.log(cameraY, 'test');

		const maxX = gameApp.app.stage.width - screenWidth; // / 4
		const maxY = gameApp.app.stage.height - screenHeight; // / 4

		console.log(cameraY, 'cameraX');

		let futureX = Math.max(0, Math.min(cameraX, maxX));
		gameApp.app.stage.x = -Math.mix(gameApp.app.stage.x, futureX, this.ease);

		let futureY = Math.max(0, Math.min(cameraY, maxY));
		gameApp.app.stage.y = -Math.mix(gameApp.app.stage.y, futureY, this.ease);

		gameApp.app.stage.scale.set(this.zoomLevel);
	}
}
