import { Assets, BitmapText } from 'pixi.js';
import { AnimatedSpriteComponent } from '../engine/components/AnimatedSpriteComponent';
import { CharacterAnimationComponent } from '../engine/components/CharacterAnimationComponent';
import { TextComponent } from '../engine/components/TextComponent';
import { GameConfig } from '../utils/Config';
import { GameEntity } from './GameEntity';

export class PlayerEntity extends GameEntity {
	constructor(id: string, playerName: string, spritesheetPath: string) {
		super(playerName);

		this.id = id;

		// Add player components
		const sprite = new AnimatedSpriteComponent(
			this,
			'IdleSouth',
			0.3,
			spritesheetPath,
			this.addPlayerNameComponent.bind(this)
		);
		this.addComponent(sprite);

		this.addComponent(new CharacterAnimationComponent(this));
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
