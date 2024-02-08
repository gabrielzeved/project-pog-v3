import type { GameEntity } from '../../entities/GameEntity';
import { Component, ComponentNames } from './Component';

export class PlayerControllerComponent extends Component {
	private speed: number;
	private dx: number = 0;
	private dy: number = 0;

	constructor(entity: GameEntity, speed: number) {
		super(entity, ComponentNames.PlayerController);
		this.speed = speed;
	}

	update(dt: number) {}
}
