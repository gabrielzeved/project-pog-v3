import * as PIXI from 'pixi.js';
import { writable } from 'svelte/store';
import InputKeyboardManager from './engine/InputKeyboardManager';
import type { GameEntity } from './entities/GameEntity';
import './utils/math';
import type { WorldData } from '@ppog/shared';
import type { Tilemap } from '@pixi/tilemap';
import { LayerManager } from './engine/LayerManager';
import { Stage } from '@pixi/layers';

export class GameApp {
	public app: PIXI.Application;
	private entities: GameEntity[] = [];
	public keyboardManager: InputKeyboardManager;
	public layerManager: LayerManager = new LayerManager();
	public connectedClients = writable<string[]>([]);
	worldMap: WorldData;

	constructor(options: Partial<PIXI.IApplicationOptions>) {
		this.app = new PIXI.Application(options);
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

		this.layerManager.add('root', 0);
		this.app.stage = new Stage();
		this.app.stage.addChild(this.layerManager.get('root'));

		this.app.ticker.add(() => this.gameLoop(this.app.ticker.elapsedMS / 1000));
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

	drawTilemap(tilemap: Tilemap | PIXI.Graphics) {
		this.app.stage.addChild(tilemap);
	}

	private gameLoop(deltaTime: number) {
		for (const entity of this.entities) {
			entity.update(deltaTime);
		}
	}
}
