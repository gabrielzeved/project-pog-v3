import { Stage } from '@pixi/layers';
import type { Tilemap } from '@pixi/tilemap';
import type { RoomState, WorldData } from '@ppog/shared';
import { Client, Room } from 'colyseus.js';
import * as PIXI from 'pixi.js';
import { writable } from 'svelte/store';
import InputKeyboardManager from './engine/InputKeyboardManager';
import { LayerManager } from './engine/LayerManager';
import type { GameEntity } from './entities/GameEntity';
import { PlayerEntity } from './entities/PlayerEntity';
import './utils/math';
import { drawLayers, initTextures } from './engine/tilemap/Tilemap';

export class GameApp {
	public app: PIXI.Application;
	private entities: GameEntity[] = [];
	public keyboardManager: InputKeyboardManager;
	public layerManager: LayerManager = new LayerManager();
	public connectedClients = writable<string[]>([]);
	worldMap: WorldData;
	public client: Client;
	public room: Room<RoomState>;

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

		this.connect();
	}

	async connect() {
		this.client = new Client('ws://localhost:3000');
		this.room = await this.client.joinOrCreate('my_room');

		this.room.state.players.onAdd((player, sessionId) => {
			const entity = new PlayerEntity(sessionId, player);
			entity.parentLayer = this.layerManager.get('root');
			entity.zOrder = 2;

			entity.position.set(player.position.x, player.position.y);
			this.addEntity(entity);
			entity.setupEvent();
		});

		this.room.state.players.onRemove((player, sessionId) => {
			this.destroyEntity(sessionId);
		});

		this.room.onMessage('WorldLoad', async (data) => {
			this.worldMap = data;

			await initTextures(this.worldMap);
			await drawLayers(this.worldMap.layers);
		});
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
