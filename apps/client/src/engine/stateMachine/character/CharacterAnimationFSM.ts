import type { GameEntity } from '../../../entities/GameEntity';
import type { AnimatedSpriteComponent } from '../../components/AnimatedSpriteComponent';
import type { CharacterAnimationComponent } from '../../components/CharacterAnimationComponent';
import { ComponentNames } from '../../components/Component';
import { FiniteStateMachine, State } from '../FSM';

export class CharacterAnimationFMS extends FiniteStateMachine {
	sprite: AnimatedSpriteComponent;

	constructor(
		public entity: GameEntity,
		public character: CharacterAnimationComponent
	) {
		super();
		this.sprite = entity.getComponent<AnimatedSpriteComponent>(ComponentNames.AnimatedSprite)!;
		this._addState('idle', IdleState);
		this._addState('walk', WalkState);
		this._addState('run', RunState);
		this._addState('attack', AttackAState);
	}
}

abstract class AnimationState extends State {
	declare _parent: CharacterAnimationFMS;

	lockUntilFinished: boolean = false;
	shouldUpdateDirection: boolean = true;
	abstract animationPrefix: string;

	_playAnimation() {
		const direction = this._parent.character.direction;

		if (direction) this._parent.sprite.changeAnimation(`${this.animationPrefix}${direction}`);
	}

	update(_: number): void {
		if (this.shouldUpdateDirection) this._playAnimation();
	}

	enter(): void {
		if (!this.lockUntilFinished) return;

		if (!this._parent.sprite.sprite) return;

		this._playAnimation();
		this._parent.sprite.sprite.loop = false;
		this._parent.sprite.sprite.onComplete = this.onComplete.bind(this);
		this.locked = true;
	}

	exit(): void {
		if (!this._parent.sprite.sprite) return;

		this._parent.sprite.sprite.loop = true;
		this._parent.sprite.sprite.onComplete = undefined;
	}

	onComplete(): void {
		this.locked = false;
	}
}

class IdleState extends AnimationState {
	animationPrefix: string = 'Idle';
	edges: Newable<State>[] = [RunState, WalkState, AttackAState];
	get name() {
		return 'idle';
	}
	update(delta: number): void {
		super.update(delta);
	}
}

class WalkState extends AnimationState {
	edges: Newable<State>[] = [IdleState, RunState, AttackAState];
	animationPrefix: string = 'Walk';

	get name() {
		return 'walk';
	}

	update(delta: number): void {
		super.update(delta);
	}
}

class RunState extends AnimationState {
	edges: Newable<State>[] = [IdleState, WalkState, AttackAState];
	animationPrefix: string = 'Run';

	get name() {
		return 'run';
	}
}

class AttackAState extends AnimationState {
	edges: Newable<State>[] = [IdleState, WalkState, RunState];
	animationPrefix: string = 'AttackA';
	lockUntilFinished = true;
	shouldUpdateDirection = false;

	get name() {
		return 'attack';
	}
}
