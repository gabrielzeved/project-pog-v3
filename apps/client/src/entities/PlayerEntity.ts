import type { Player } from '@ppog/shared';
import { vec2 } from 'gl-matrix';
import { Assets, BitmapText } from 'pixi.js';
import { AnimatedSpriteComponent } from '../engine/components/AnimatedSpriteComponent';
import { CharacterAnimationComponent } from '../engine/components/CharacterAnimationComponent';
import { ComponentNames } from '../engine/components/Component';
import { PlayerControllerComponent } from '../engine/components/PlayerControllerComponent';
import { TextComponent } from '../engine/components/TextComponent';
import { gameApp } from '../main';
import { GameConfig } from '../utils/Config';
import { GameEntity } from './GameEntity';

export class PlayerEntity extends GameEntity {
	private _player: Player;
	public serverPosition: vec2;

	constructor(sessionId: string, player: Player) {
		super(player.username);

		this._player = player;

		this.id = sessionId;

		// Add player components
		const sprite = new AnimatedSpriteComponent(
			this,
			'IdleSouth',
			0.3,
			'/assets/player/data.json',
			this.addPlayerNameComponent.bind(this)
		);
		this.addComponent(sprite);

		this.addComponent(new CharacterAnimationComponent(this));

		if (gameApp.room.sessionId === sessionId) {
			this.addComponent(new PlayerControllerComponent(this, 100.0));
		}
	}

	setupEvent() {
		this._player.position.onChange(() => {
			if (gameApp.room.sessionId !== this.id) {
				this.serverPosition = [this._player.position.x, this._player.position.y];
			}
		});
	}

	addPlayerNameComponent(sprite: AnimatedSpriteComponent) {
		Assets.load(GameConfig.fonts.default.path).then(() => {
			const text = new BitmapText(this.name.toLocaleLowerCase(), {
				fontName: GameConfig.fonts.default.name,
				fontSize: 8,
				align: 'left',
				letterSpacing: 16
			});

			const spriteWidth = sprite.sprite?.texture.orig.width ?? 64;

			const textX = spriteWidth / 2 - text.width / 2;
			const textY = -8;

			this.addComponent(new TextComponent(this, text, textX, textY));
		});
	}

	update(deltaTime: number): void {
		super.update(deltaTime);

		if (gameApp.room.sessionId === this.id) return;

		const newPosition: vec2 = [0, 0];
		vec2.lerp(newPosition, [this.position.x, this.position.y], this.serverPosition, 0.6);

		let direction = vec2.sub(
			[0, 0],
			[newPosition[0], newPosition[1]],
			[this.position.x, this.position.y]
		);

		if (vec2.length(direction) < 0.01) direction = [0, 0];

		this.getComponent<CharacterAnimationComponent>(
			ComponentNames.CharacterAnimation
		)?.updateDirection(direction);

		this.position.x = newPosition[0];
		this.position.y = newPosition[1];
	}
}
