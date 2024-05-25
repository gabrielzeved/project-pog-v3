import * as PIXI from 'pixi.js';
import type { GameEntity } from '../../entities/GameEntity';
import { Component, ComponentNames } from './Component';

export interface SpritesheetData extends PIXI.ISpritesheetData {
	meta: any;
}

interface AsepriteSpritesheetData extends SpritesheetData {
	meta: {
		app: string;
		scale: string;
		related_multi_packs?: string[];
		frameTags: [
			{
				name: string;
				from: number;
				to: number;
				direction: string;
				color: string;
			}
		];
	};
}

export class AnimatedSpriteComponent extends Component {
	sprite: PIXI.AnimatedSprite;
	spritesheet?: PIXI.Spritesheet;
	private currentAnimation: string;
	onLoadCallback: (sprite: AnimatedSpriteComponent) => void;

	constructor(
		entity: GameEntity,
		initialAnimation: string,
		public speed: number,
		spritesheetFile: string,
		onLoadCallback: (sprite: AnimatedSpriteComponent) => void
	) {
		super(entity, ComponentNames.AnimatedSprite);
		this.currentAnimation = initialAnimation;
		this.onLoadCallback = onLoadCallback;
		this.loadSpritesheet(spritesheetFile);
	}

	aseprite(spritesheet: AsepriteSpritesheetData): void {
		const meta = spritesheet.meta;
		const isAseprite = meta.app === 'http://www.aseprite.org/';

		if (!isAseprite) return;

		const asepriteInfo = (spritesheet as AsepriteSpritesheetData).meta;

		for (const tag of asepriteInfo.frameTags) {
			const frames = [];
			for (let i = tag.from; i < tag.to; i++) {
				const frameKey = Object.keys(spritesheet.frames)[i];
				frames.push(frameKey);
			}

			if (tag.direction === 'pingpong') {
				for (let i = tag.to; i >= tag.from; i--) {
					const frameKey = Object.keys(spritesheet.frames)[i];
					frames.push(frameKey);
				}
			}
			spritesheet.animations ??= {};
			spritesheet.animations[tag.name] = frames;
		}
	}

	async loadSpritesheet(spritesheetFile: string) {
		const spritesheet = (await PIXI.Assets.load(spritesheetFile)) as PIXI.Spritesheet;
		this.aseprite(spritesheet.data as SpritesheetData);
		this.spritesheet = spritesheet;
		this.spritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
		this.spritesheet.parse().then(() => {
			this.sprite = new PIXI.AnimatedSprite(this.spritesheet!.animations[this.currentAnimation]);
			this.sprite.animationSpeed = this.speed;
			this.entity.addChild(this.sprite);
			this.sprite.play();
			this.onLoadCallback(this);
		});
	}

	setSpeed(speed: number) {
		this.sprite.animationSpeed = speed;
	}

	changeAnimation(key: string) {
		if (!this.spritesheet) return;

		if (this.currentAnimation !== key) {
			this.sprite.textures = this.spritesheet!.animations[key];
			this.play();
			this.currentAnimation = key;
		}
	}

	stop() {
		this.sprite.stop();
	}

	play() {
		this.sprite.play();
	}

	isPlaying() {
		return this.sprite.playing;
	}

	destroy() {
		this.entity.destroy();
	}
}
