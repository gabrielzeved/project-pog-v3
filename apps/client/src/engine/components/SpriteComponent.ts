import type { GameEntity } from '../../entities/GameEntity';
import { Sprite } from 'pixi.js';
import { Component, ComponentNames } from './Component';

export class SpriteComponent extends Component {
	public sprite: Sprite;

	constructor(entity: GameEntity, spritePath: string) {
		super(entity, ComponentNames.Sprite);

		this.sprite = this.loadSprite(spritePath);
		this.sprite.anchor.set(0.5);
		this.entity.addChild(this.sprite);
	}

	loadSprite(path: string) {
		return Sprite.from(path);
	}

	setPosition(x: number, y: number) {
		this.sprite.x = x;
		this.sprite.y = y;
	}

	/**
	 * Sets the width and height of the sprite.
	 *
	 * @param {number} width - The desired width of the sprite.
	 * @param {number} height - The desired height of the sprite.
	 */
	setWidthAndHeight(width: number, height: number) {
		this.sprite.width = width;
		this.sprite.height = height;
	}

	hide() {
		this.sprite.visible = false;
	}

	show() {
		this.sprite.visible = true;
	}

	destroy() {
		this.sprite.destroy();
	}
}
