import { Stage } from '@pixi/layers';
import type { Tilemap } from '@pixi/tilemap';
import { Enemy, EntityType, Player, type RoomState, type WorldData } from '@ppog/shared';
import { Client, Room } from 'colyseus.js';
import * as PIXI from 'pixi.js';
import { writable } from 'svelte/store';
import InputKeyboardManager from './engine/InputKeyboardManager';
import { LayerManager } from './engine/managers/LayerManager';
import { EnemyEntity } from './entities/EnemyEntity';
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

	constructor(public options: Partial<PIXI.IApplicationOptions>) {}

	init() {
		this.app = new PIXI.Application(this.options);
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

	async connect() {
		this.client = new Client('ws://localhost:3000');

		const authToken = localStorage.getItem('pog@auth-token');

		if (!authToken) {
			console.error('Error connecting to game room: Not authenticated.');
			return;
		}

		this.client.auth.token = authToken;
		this.room = await this.client.joinOrCreate('my_room');

		this.room.state.entities.onAdd((entity, sessionId) => {
			let gameEntity: GameEntity;

			if (entity.type == EntityType.ENEMY) {
				gameEntity = new EnemyEntity(entity.id, entity as Enemy);
			} else if (entity.type == EntityType.PLAYER) {
				gameEntity = new PlayerEntity(sessionId, entity as Player);
			}

			gameEntity.position.set(entity.position.x, entity.position.y);
			gameEntity.zOrder = 99;

			this.addEntity(gameEntity);
		});

		this.room.state.entities.onRemove((_, id) => {
			this.destroyEntity(id);
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
