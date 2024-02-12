import type { vec2 } from 'gl-matrix';
import type { GameEntity } from '../../entities/GameEntity';
import { CharacterAnimationFMS } from '../stateMachine/character/CharacterAnimationFSM';
import { Component, ComponentNames } from './Component';

export type Direction = 'South' | 'North' | 'East' | 'West';

export class CharacterAnimationComponent extends Component {
	direction: Direction = 'South';
	isRunning: boolean = false;
	isMoving: boolean = false;

	canMove: boolean = true;

	stateMachine: CharacterAnimationFMS;

	constructor(entity: GameEntity) {
		super(entity, ComponentNames.CharacterAnimation);

		this.stateMachine = new CharacterAnimationFMS(this.entity, this);
		this.stateMachine.setState('idle');
	}

	update(_: number): void {
		let action: string;

		if (!this.isMoving) {
			action = 'idle';
		} else {
			action = this.isRunning ? 'run' : 'walk';
		}

		this.stateMachine.update(0.0, action);
	}

	updateDirection(direction: vec2) {
		let dir: string = '';

		if (direction[0] < 0) dir = 'West';
		else if (direction[0] > 0) dir = 'East';
		else if (direction[1] > 0) dir = 'South';
		else if (direction[1] < 0) dir = 'North';
		else dir = '';

		if (dir) {
			this.direction = dir as Direction;
			this.isMoving = true;
		} else {
			this.isMoving = false;
		}
	}
}
