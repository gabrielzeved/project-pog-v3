import { Entity, type Vector2 } from '@ppog/shared';
import * as PIXI from 'pixi.js';

export class GameEntity extends Entity {
	public sprite: PIXI.Sprite;
	private speed: number = 5;

	constructor(id: string, position: Vector2, spritePath: string) {
		super(id, position, spritePath);

		this.sprite = this.loadSprite(spritePath);
		this.sprite.name = id;
		this.sprite.anchor.set(0.5);
		this.sprite.x = position.x;
		this.sprite.y = position.y;
	}

	update(): void {}

	loadSprite(path: string) {
		return PIXI.Sprite.from(path);
	}
}
