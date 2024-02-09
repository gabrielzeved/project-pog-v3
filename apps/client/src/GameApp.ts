import * as PIXI from 'pixi.js';
import { writable } from 'svelte/store';
import InputKeyboardManager from './engine/InputKeyboardManager';
import type { GameEntity } from './entities/GameEntity';
export class GameApp {
	private app: PIXI.Application;
	private entities: GameEntity[] = [];
	public keyboardManager: InputKeyboardManager;
	public connectedClients = writable<string[]>([]);

	constructor(options: Partial<PIXI.IApplicationOptions>) {
		this.app = new PIXI.Application(options);
		this.app.stage.scale.set(1, 1);
		this.app.renderer.resize(window.innerWidth, window.innerHeight);
		window.addEventListener('resize', (e) => {
			this.app.renderer.resize(window.innerWidth, window.innerHeight);
		});

		this.keyboardManager = new InputKeyboardManager(
			{
				UP: 'w',
				DOWN: 's',
				RIGHT: 'd',
				LEFT: 'a',
				SPACE: ' '
			},
			this.app
		);

		this.app.ticker.add((dt) => this.gameLoop(dt));
		this.app.start();
	}

	getEntity(id: string) {
		return this.entities.find((entity) => entity.id === id);
	}

	addEntity(entity: GameEntity) {
		this.entities.push(entity);
		this.app.stage.addChild(entity);
	}

	destroyEntity(id: string) {
		const index = this.entities.findIndex((entity) => entity.id === id);
		if (index === -1) return;
		const entity = this.entities[index];
		this.entities.splice(index, 1);
		entity.kill();
	}

	private gameLoop(deltaTime: number) {
		for (const entity of this.entities) {
			entity.update(deltaTime);
		}
	}
}
