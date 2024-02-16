import type { EntitySnapshotPacketData } from '@ppog/shared/packets/client/entities/EntitySnapshotPacket';
import { vec2 } from 'gl-matrix';
import type { GameEntity } from '../../entities/GameEntity';
import type { CharacterAnimationComponent } from './CharacterAnimationComponent';
import { Component, ComponentNames } from './Component';

interface PositionUpdate {
	time: number;
	position: vec2;
}

const INTERPOLATION_DELAY = 0.05;

export class NetworkEntityComponent extends Component {
	private _updates: PositionUpdate[] = [];
	private _targetPos: PositionUpdate | undefined;
	private _lastPos: PositionUpdate | undefined;
	private _lastUpdate: number = 0.0;

	private direction: vec2 = [0, 0];

	constructor(entity: GameEntity) {
		super(entity, ComponentNames.NetworkEntity);
	}

	get lastPosition(): vec2 {
		return this._lastPos?.position ?? [this.entity.position.x, this.entity.position.y];
	}

	onNetworkUpdate(packet: EntitySnapshotPacketData) {
		this._updates.push({
			time: INTERPOLATION_DELAY,
			position: packet.position
		});
		this._lastUpdate = 0.0;

		if (this._targetPos === null) {
			this.entity.setPosition(packet.position[0], packet.position[1]);
		}

		this.direction = packet.velocity;
	}

	update(delta: number): void {
		this._lastUpdate += delta;

		if (this._updates.length === 0) return;

		for (let update of this._updates) {
			update.time -= delta;
		}

		while (this._updates.length > 0 && this._updates[0].time <= 0.0) {
			this._lastPos = {
				position: [
					...(this._targetPos?.position || [this.entity.position.x, this.entity.position.y])
				] as vec2,
				time: this._targetPos?.time ?? 0.0
			};

			this._targetPos = this._updates.shift();
			this._targetPos!.time = 0.0;
		}

		if (this._targetPos && this._lastPos) {
			this._targetPos.time += delta;

			const t = Math.clamp(this._targetPos.time / INTERPOLATION_DELAY, 0.0, 1.0);

			const targetX = Math.lerp(this._lastPos.position[0], this._targetPos.position[0], t);
			const targetY = Math.lerp(this._lastPos.position[1], this._targetPos.position[1], t);

			const targetPos: vec2 = [targetX, targetY];

			this.entity.setPosition(targetPos[0], targetPos[1]);
		}

		this.entity
			.getComponent<CharacterAnimationComponent>(ComponentNames.CharacterAnimation)
			?.updateDirection(this.direction);
	}
}
