import { ServerPackets } from '@ppog/shared';
import { vec2 } from 'gl-matrix';
import type { GameEntity } from '../../entities/GameEntity';
import { client, gameApp } from '../../main';
import { Component, ComponentNames } from './Component';

export class PlayerControllerComponent extends Component {
	private speed: number;
	private velocity: vec2 = [0, 0];

	constructor(entity: GameEntity, speed: number) {
		super(entity, ComponentNames.PlayerController);
		this.speed = speed;
	}

	update(dt: number) {
		const input = gameApp.keyboardManager;

		const lastVelocity = vec2.copy([0, 0], this.velocity);

		const velocity: vec2 = [0, 0];

		if (input.isKeyDown('UP')) {
			vec2.add(velocity, velocity, [0, -1]);
		} else if (input.isKeyDown('DOWN')) {
			vec2.add(velocity, velocity, [0, 1]);
		} else if (input.isKeyDown('RIGHT')) {
			vec2.add(velocity, velocity, [1, 0]);
		} else if (input.isKeyDown('LEFT')) {
			vec2.add(velocity, velocity, [-1, 0]);
		}

		vec2.normalize(velocity, velocity);

		if (!vec2.equals(lastVelocity, velocity)) {
			const packet = new ServerPackets.PlayerVelocityPacket(this.entity.id, velocity);
			client.sendPacket(packet);
		}

		this.velocity = velocity;

		// this.entity.position.x = this.entity.position.x + this.velocity[0] * this.speed * dt;
		// this.entity.position.y = this.entity.position.y + this.velocity[1] * this.speed * dt;
	}
}
