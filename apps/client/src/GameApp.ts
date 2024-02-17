import * as PIXI from 'pixi.js';
import { writable } from 'svelte/store';
import InputKeyboardManager from './engine/InputKeyboardManager';
import type { GameEntity } from './entities/GameEntity';
import './utils/math';
import type { WorldData } from '@ppog/shared';
import type { Tilemap } from '@pixi/tilemap';
import { LayerManager } from './engine/LayerManager';
import { Stage } from '@pixi/layers';
import { Viewport } from 'pixi-viewport';

export class GameApp {
	public app: PIXI.Application;
	private entities: GameEntity[] = [];
	public keyboardManager: InputKeyboardManager;
	public layerManager: LayerManager = new LayerManager();
	public viewport: Viewport;
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

		this.viewport = new Viewport({
			events: this.app.renderer.events,
			ticker: this.app.ticker,
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
		});

		this.viewport.decelerate({
			friction: 0.95, // percent to decelerate after movement
			bounce: 0.8, // percent to decelerate when past boundaries (only applicable when viewport.bounce() is active)
			minSpeed: 0.01 // minimum velocity before stopping/reversing acceleration
		});

		this.viewport.clamp({
			left: false, // whether to clamp to the left and at what value
			right: false, // whether to clamp to the right and at what value
			top: false, // whether to clamp to the top and at what value
			bottom: false, // whether to clamp to the bottom and at what value
			direction: 'all', // (all, x, or y) using clamps of [0, viewport.worldWidth / viewport.worldHeight]; replaces left / right / top / bottom if set
			underflow: 'center' // where to place world if too small for screen (e.g., top - right, center, none, bottomleft)
		});

		this.viewport.scale.set(2, 2);

		this.app.stage.addChild(this.viewport);

		this.viewport.addChild(this.layerManager.get('root'));

		this.app.ticker.add(() => this.gameLoop(this.app.ticker.elapsedMS / 1000));
		this.app.start();
	}

	getEntity(id: string) {
		return this.entities.find((entity) => entity.id === id);
	}

	addEntity(entity: GameEntity) {
		this.entities.push(entity);
		this.viewport.addChild(entity);
	}

	destroyEntity(id: string) {
		const index = this.entities.findIndex((entity) => entity.id === id);
		if (index === -1) return;
		const entity = this.entities[index];
		this.entities.splice(index, 1);
		entity.kill();
	}

	drawTilemap(tilemap: Tilemap | PIXI.Graphics) {
		this.viewport.addChild(tilemap);
	}

	private gameLoop(deltaTime: number) {
		for (const entity of this.entities) {
			entity.update(deltaTime);
		}
	}
}
