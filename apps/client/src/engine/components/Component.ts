import type { GameEntity } from '../../entities/GameEntity';

export enum ComponentNames {
	Sprite = 'SpriteComponent',
    PlayerController = 'PlayerControllerComponent'
}

export class Component {
	entity!: GameEntity;
	enabled: boolean = true;

	constructor(
		entity: GameEntity,
		public name: string
	) {
		this.entity = entity;
	}

	setEnabled(enabled: boolean) {
		this.enabled = enabled;
	}

	update(delta: number) {}
}
