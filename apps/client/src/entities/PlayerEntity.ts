import type { Player } from '@ppog/shared';
import { ActionType } from '@ppog/shared/actions/ActionType';
import { vec2 } from 'gl-matrix';
import { Assets, BitmapText } from 'pixi.js';
import { AnimatedSpriteComponent } from '../engine/components/AnimatedSpriteComponent';
import { CharacterAnimationComponent } from '../engine/components/CharacterAnimationComponent';
import { ComponentNames } from '../engine/components/Component';
import { HealthbarComponent } from '../engine/components/HealthbarComponent';
import { PlayerControllerComponent } from '../engine/components/PlayerControllerComponent';
import { TextComponent } from '../engine/components/TextComponent';
import { gameApp } from '../main';
import { GameConfig } from '../utils/Config';
import { GameEntity } from './GameEntity';
export class PlayerEntity extends GameEntity<Player> {
	constructor(sessionId: string, player: Player) {
		super(player.username, player);

		this.id = sessionId;

		// Add player components
		const sprite = new AnimatedSpriteComponent(
			this,
			'IdleSouth',
			0.3,
			'/assets/player/data.json',
			this.spriteCallback.bind(this)
		);
		this.addComponent(sprite);

		this.addComponent(new CharacterAnimationComponent(this));

		if (gameApp.room.sessionId === sessionId) {
			this.addComponent(new PlayerControllerComponent(this, 3));
		}
	}

	setupEvent(): void {
		super.setupEvent();

		this.state.listen('currentAction', (currentAction) => {
			if (currentAction === ActionType.SLASH) {
				this.getComponent<CharacterAnimationComponent>(ComponentNames.CharacterAnimation).attack();
			}
		});
	}

	spriteCallback(sprite: AnimatedSpriteComponent) {
		Assets.load(GameConfig.fonts.default.path).then(() => {
			const text = new BitmapText(this.name.toLocaleLowerCase(), {
				fontName: GameConfig.fonts.default.name,
				fontSize: 8,
				align: 'left',
				letterSpacing: 16
			});

			const spriteWidth = sprite.sprite?.texture.orig.width ?? 64;

			const textX = spriteWidth / 2 - text.width / 2;
			const textY = -12;
			this.addComponent(new TextComponent(this, text, textX, textY));

			const healthX = spriteWidth / 2 - 32;
			const healthY = -4;
			this.addComponent(new HealthbarComponent(this, healthX, healthY, 64, 16, 'sharp'));
		});
	}

	update(deltaTime: number): void {
		super.update(deltaTime);

		// if (gameApp.room.sessionId === this.id) return;

		const newPosition: vec2 = [0, 0];
		vec2.lerp(newPosition, [this.position.x, this.position.y], this._serverPosition, 0.6);

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
