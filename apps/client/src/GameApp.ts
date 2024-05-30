import { Stage } from '@pixi/layers';
import type { Tilemap } from '@pixi/tilemap';
import { Enemy, EntityType, Player, type MainRoomState, type WorldData } from '@ppog/shared';
import { Client, Room } from 'colyseus.js';
import * as PIXI from 'pixi.js';
import InputKeyboardManager from './engine/InputKeyboardManager';
import { LayerManager } from './engine/managers/LayerManager';
import { EnemyEntity } from './entities/EnemyEntity';
import type { GameEntity } from './entities/GameEntity';
import { PlayerEntity } from './entities/PlayerEntity';
import './utils/math';
import { drawLayers, initTextures } from './engine/tilemap/Tilemap';
import { ChatManager } from './engine/managers/ChatManager';

export class GameApp {
	public app: PIXI.Application;
	private entities: GameEntity[] = [];
	public keyboardManager: InputKeyboardManager;
	public layerManager: LayerManager;
	public chatManager: ChatManager;
	public worldMap: WorldData;
	public client: Client;
	public room: Room<MainRoomState>;

	constructor(public options: Partial<PIXI.IApplicationOptions>) {}

	init() {
		this.setupApplication();
		this.setupResizeHandler();
		this.setupKeyboardManager();
		this.setupLayerManager();
		this.startGameLoop();
	}

	private setupApplication(): void {
		this.app = new PIXI.Application(this.options);
		this.app.renderer.resize(window.innerWidth, window.innerHeight);
	}

	private setupResizeHandler(): void {
		window.addEventListener('resize', () => {
			this.app.renderer.resize(window.innerWidth, window.innerHeight);
		});
	}

	private setupKeyboardManager(): void {
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
	}

	private setupLayerManager(): void {
		this.layerManager = new LayerManager();
		this.layerManager.add('root', 0);
		this.app.stage = new Stage();
		this.app.stage.addChild(this.layerManager.get('root'));
	}

	private startGameLoop(): void {
		this.app.ticker.add((delta) => this.gameLoop(delta / 1000));
		this.app.start();
	}

	public async connect(): Promise<void> {
		try {
			await this.initializeClient();
			await this.joinRoom();
			this.setupRoomHandlers();
		} catch (error) {
			console.error('Error connecting to game room:', error);
		}
	}

	private async initializeClient(): Promise<void> {
		this.client = new Client('ws://localhost:3000');
		const authToken = localStorage.getItem('pog@auth-token');
		if (!authToken) {
			throw new Error('Not authenticated.');
		}
		this.client.auth.token = authToken;
	}

	private async joinRoom(): Promise<void> {
		this.room = await this.client.joinOrCreate('my_room');
	}

	private setupRoomHandlers(): void {
		this.room.state.entities.onAdd((entity, sessionId) => this.handleEntityAdd(entity, sessionId));
		this.room.state.entities.onRemove((_, id) => this.handleEntityRemove(id));
		this.room.onMessage('WorldLoad', (data) => this.handleWorldLoad(data));
	}

	private handleEntityAdd(entity: any, sessionId: string): void {
		let gameEntity: GameEntity;

		if (entity.type === EntityType.ENEMY) {
			gameEntity = new EnemyEntity(entity.id, entity as Enemy);
		} else if (entity.type === EntityType.PLAYER) {
			gameEntity = new PlayerEntity(sessionId, entity as Player);
		}

		gameEntity.position.set(entity.position.x, entity.position.y);
		gameEntity.zOrder = 99; // Temporary

		this.addEntity(gameEntity);
	}

	private handleEntityRemove(id: string): void {
		this.destroyEntity(id);
	}

	private async handleWorldLoad(data: WorldData): Promise<void> {
		this.worldMap = data;
		await initTextures(this.worldMap);
		await drawLayers(this.worldMap.layers);

		this.setupChatManager();
	}

	private setupChatManager() {
		this.chatManager = new ChatManager(this.client);
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
