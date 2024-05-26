import { vec2 } from 'gl-matrix';
import type { GameEntity } from '../../entities/GameEntity';
import { gameApp } from '../../main';
import type { CharacterAnimationComponent } from './CharacterAnimationComponent';
import { Component, ComponentNames } from './Component';

export class PlayerControllerComponent extends Component {
	private speed: number;
	private velocity: vec2 = [0, 0];
	public direction: vec2 = [0, 0];
	private _lastDirection: vec2 = [0, 0];

	constructor(entity: GameEntity, speed: number) {
		super(entity, ComponentNames.PlayerController);
		this.speed = speed;
	}

	update(dt: number) {
		const input = gameApp.keyboardManager;

		vec2.copy(this._lastDirection, this.direction);

		const direction: vec2 = [0, 0];

		if (input.isKeyDown('UP')) {
			vec2.add(direction, direction, [0, -1]);
		}
		if (input.isKeyDown('DOWN')) {
			vec2.add(direction, direction, [0, 1]);
		}
		if (input.isKeyDown('RIGHT')) {
			vec2.add(direction, direction, [1, 0]);
		}
		if (input.isKeyDown('LEFT')) {
			vec2.add(direction, direction, [-1, 0]);
		}

		vec2.normalize(this.direction, direction);

		this.entity
			.getComponent<CharacterAnimationComponent>(ComponentNames.CharacterAnimation)
			?.updateDirection(this.direction);
	}
}
