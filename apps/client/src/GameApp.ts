import * as PIXI from 'pixi.js';
import { Entity } from '@ppog/shared';
import { writable } from 'svelte/store';
import type { GameEntity } from './entities/GameEntity';

export class GameApp {
	private app: PIXI.Application;
	private entities: Entity[] = [];
	public connectedClients = writable<string[]>([]);

	constructor(options: Partial<PIXI.IApplicationOptions>) {
		this.app = new PIXI.Application(options);
		this.app.stage.scale.set(1, 1);
		this.app.renderer.resize(window.innerWidth, window.innerHeight);
		window.addEventListener('resize', (e) => {
			this.app.renderer.resize(window.innerWidth, window.innerHeight);
		});
		this.app.ticker.add(() => this.gameLoop());
		this.app.start();
	}

	getEntity(id: string) {
		return this.entities.find((entity) => entity.id === id);
	}

	addEntity(entity: GameEntity) {
		this.entities.push(entity);

		entity.sprite && this.app.stage.addChild(entity.sprite);
	}

	destroyEntity(id: string) {
		const index = this.entities.findIndex((entity) => entity.id === id);
		if (index === -1) return;
		this.entities.splice(index, 1);
	}

	private gameLoop() {
		// do something
	}
}
