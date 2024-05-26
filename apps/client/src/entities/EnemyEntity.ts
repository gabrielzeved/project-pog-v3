import type { Enemy } from '@ppog/shared';
import { Assets, BitmapText } from 'pixi.js';
import { AnimatedSpriteComponent } from '../engine/components/AnimatedSpriteComponent';
import { TextComponent } from '../engine/components/TextComponent';
import { GameConfig } from '../utils/Config';
import { GameEntity } from './GameEntity';

export class EnemyEntity extends GameEntity {
	constructor(id: string, entity: Enemy) {
		super(entity.name, entity);

		this.id = id;

		const sprite = new AnimatedSpriteComponent(
			this,
			'IdleSouth',
			0.3,
			'/assets/enemy/data.json',
			this.addPlayerNameComponent.bind(this)
		);
		this.addComponent(sprite);
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
}
