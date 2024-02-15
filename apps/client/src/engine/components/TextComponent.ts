import { BitmapText } from 'pixi.js';
import { Component, ComponentNames } from './Component';
import type { GameEntity } from '../../entities/GameEntity';

export class TextComponent extends Component {
	/**
	 * Constructor for the Sprite component.
	 *
	 * @param {Entity} entity - the parent game entity
	 * @param {number} localX - the local x coordinate (default: 0)
	 * @param {number} localY - the local y coordinate (default: 0)
	 */
	constructor(
		entity: GameEntity,
		public text: BitmapText,
		localX = 0,
		localY = 0
	) {
		super(entity, ComponentNames.Text);

		this.setPosition(localX, localY);
		this.entity.addChild(this.text);
	}

	/**
	 * Sets the position of the text in LOCAL coordinates.
	 * @param x
	 * @param y
	 */
	setPosition(x: number, y: number) {
		this.text.x = x;
		this.text.y = y;
	}

	setAnchor(val: number) {
		this.text.anchor.set(val);
	}

	setRotation(angle: number) {
		this.text.rotation = angle;
	}

	hide() {
		this.text.visible = false;
	}

	show() {
		this.text.visible = true;
	}

	destroy() {
		this.text.destroy();
	}
}
