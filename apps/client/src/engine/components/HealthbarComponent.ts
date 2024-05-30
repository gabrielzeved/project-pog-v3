import type { Rectangle } from '@ppog/shared';
import type { DamagableEntity } from '@ppog/shared/entities/DamagableEntity';
import * as PIXI from 'pixi.js';
import type { GameEntity } from '../../entities/GameEntity';
import { HealthBarData } from '../../utils/constants/HealthbarData';
import { Component, ComponentNames } from './Component';

export type HealthbarVariant = 'default' | 'sharp' | 'rounded';

export interface NineSliceDefinition {
	leftWidth: number;
	topHeight: number;
	rightWidth: number;
	bottomHeight: number;
}

export interface HealthbarMetadata {
	rect: Rectangle;
	offset: Rectangle;
	slice: NineSliceDefinition;
}

export class HealthbarComponent extends Component {
	private graphics: PIXI.Graphics;
	private frame: PIXI.NineSlicePlane;

	declare entity: GameEntity<DamagableEntity>;

	constructor(
		entity: GameEntity<DamagableEntity>,
		localX = 0,
		localY = 0,
		width = 100,
		height = 16,
		public variant: HealthbarVariant = 'sharp'
	) {
		super(entity, ComponentNames.Text);

		this.graphics = new PIXI.Graphics();

		const data = HealthBarData[variant];

		const asset = PIXI.Assets.load('/assets/ui/texture.png');

		asset.then((baseTexture) => {
			const texture = new PIXI.Texture(
				baseTexture,
				new PIXI.Rectangle(data.rect.x, data.rect.y, data.rect.width, data.rect.height)
			);

			this.frame = new PIXI.NineSlicePlane(
				texture,
				data.slice.leftWidth,
				data.slice.topHeight,
				data.slice.rightWidth,
				data.slice.bottomHeight
			);

			this.setSize(width, height);

			this.graphics.addChild(this.frame);
			this.draw();
		});

		this.setPosition(localX, localY);
		this.entity.addChild(this.graphics);
		this.setupEvent();
	}

	setupEvent() {
		this.entity.state.listen('health', this.draw.bind(this));
		this.entity.state.listen('maxHealth', this.draw.bind(this));
	}

	setSize(width: number, height: number) {
		this.frame.height = height;
		this.frame.width = width;
		this.draw();
	}

	draw() {
		if (!this.frame) return;

		const percentage = this.entity.state.health / this.entity.state.maxHealth;

		const data = HealthBarData[this.variant];

		this.graphics.clear();
		this.graphics.beginFill(0x00ff00);
		this.graphics.drawRect(
			data.offset.x,
			data.offset.y,
			(this.frame.width - data.offset.width) * percentage,
			this.frame.height - data.offset.height
		);
		this.graphics.endFill();
	}

	setPosition(x: number, y: number) {
		this.graphics.x = x;
		this.graphics.y = y;
	}

	hide() {
		this.graphics.visible = false;
	}

	show() {
		this.graphics.visible = true;
	}

	destroy() {
		this.graphics.destroy();
	}
}
