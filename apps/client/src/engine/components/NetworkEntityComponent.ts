import { TPS } from '@ppog/shared';
import type { EntitySnapshotPacketData } from '@ppog/shared/packets/client/entities/EntitySnapshotPacket';
import { vec2 } from 'gl-matrix';
import type { GameEntity } from '../../entities/GameEntity';
import type { CharacterAnimationComponent } from './CharacterAnimationComponent';
import { Component, ComponentNames } from './Component';

interface PositionUpdate {
	time: number;
	position: vec2;
	direction: vec2;
}

const INTERPOLATION_DELAY = 1 / TPS;

export class NetworkEntityComponent extends Component {
	private _updates: PositionUpdate[] = [];
	private _targetPos: PositionUpdate | undefined;
	private _lastPos: PositionUpdate | undefined;
	private _lastUpdate: number = 0.0;

	private direction: vec2 = [0, 0];

	constructor(entity: GameEntity) {
		super(entity, ComponentNames.NetworkEntity);
	}

	onNetworkUpdate(packet: EntitySnapshotPacketData) {
		this._updates.push({
			time: INTERPOLATION_DELAY,
			position: packet.position,
			direction: packet.velocity
		});
		this._lastUpdate = 0.0;

		if (this._targetPos === null) {
			this.entity.setPosition(packet.position[0], packet.position[1]);
		}
	}

	update(delta: number): void {
		this._lastUpdate += delta;

		if (this._updates.length === 0) return;

		for (let update of this._updates) {
			update.time -= delta;
		}

		while (this._updates.length > 1 && this._updates[0].time <= 0) {
			this._lastPos = this._updates.shift();
			this._targetPos = this._updates[0];
		}

		if (this._targetPos && this._lastPos) {
			const t = Math.clamp(
				(INTERPOLATION_DELAY - this._targetPos.time) / INTERPOLATION_DELAY,
				0.0,
				1.0
			);

			const targetX = Math.lerp(this._lastPos.position[0], this._targetPos.position[0], t);
			const targetY = Math.lerp(this._lastPos.position[1], this._targetPos.position[1], t);

			const targetPos: vec2 = [targetX, targetY];

			this.entity.setPosition(targetPos[0], targetPos[1]);
			this.direction = this._targetPos.direction;
		}

		this.entity
			.getComponent<CharacterAnimationComponent>(ComponentNames.CharacterAnimation)
			?.updateDirection(this.direction);
	}
}
