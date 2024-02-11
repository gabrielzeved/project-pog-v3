import { ServerPackets, processInput, processSnapshot, type Snapshot } from '@ppog/shared';
import type { EntitySnapshotPacketData } from '@ppog/shared/packets/client/entities/EntitySnapshotPacket';
import { vec2 } from 'gl-matrix';
import type { GameEntity } from '../../entities/GameEntity';
import { client, gameApp } from '../../main';
import { Component, ComponentNames } from './Component';

interface InputPayload {
	tick: number;
	direction: vec2;
	delta: number;
}

type State = Snapshot & {
	tick: number;
};

export class PlayerControllerComponent extends Component {
	private speed: number;
	private velocity: vec2 = [0, 0];
	private direction: vec2 = [0, 0];
	private _lastDirection: vec2 = [0, 0];

	//NETWORK
	private _inputSequenceNumber: number = 0;
	private _pendingInputs: InputPayload[] = [];
	private _lastSnapshot?: State;
	private _lastProcessedSnapshot?: State;

	constructor(entity: GameEntity, speed: number) {
		super(entity, ComponentNames.PlayerController);
		this.speed = speed;
	}

	onNetworkUpdate(packet: EntitySnapshotPacketData) {
		this._lastSnapshot = {
			position: packet.position,
			velocity: packet.velocity,
			tick: packet.tick
		};

		this.handleServerReconcillitation(this._lastSnapshot!);
		this.applySnapshot(this._lastSnapshot!);

		// if (
		// 	this._lastSnapshot &&
		// 	(!this._lastProcessedSnapshot || this._lastSnapshot.tick > this._lastProcessedSnapshot.tick)
		// ) {
		// 	this.handleServerReconciliation();
		// }
		// this.handleServerReconcillitation();
	}

	handleServerReconcillitation(snapshot: Snapshot) {
		let finalSnapshot = snapshot;

		let j = 0;
		while (j < this._pendingInputs.length) {
			const input = this._pendingInputs[j];
			if (input.tick < this._lastSnapshot!.tick) {
				this._pendingInputs.splice(j, 1);
			} else {
				finalSnapshot = processSnapshot(
					{
						position: snapshot.position,
						velocity: processInput(input.direction)
					},
					input.delta
				);

				j++;
			}
		}
		return finalSnapshot;
	}

	applySnapshot(snapshot: Snapshot) {
		this.velocity = snapshot.velocity;
		this.entity.setPosition(snapshot.position[0], snapshot.position[1]);
	}

	// processMovementAsServer(inputPayload: InputPayload): StatePayload {
	// 	const newVelocity = processInput(inputPayload.direction);

	// 	const newSnapshot = processSnapshot(
	// 		{
	// 			...this._lastSnapshot!,
	// 			velocity: newVelocity
	// 		},
	// 		1 / TPS
	// 	);

	// 	return {
	// 		tick: inputPayload.tick,
	// 		position: newSnapshot.position
	// 	};
	// }

	// handleServerReconciliation() {
	// 	this._lastProcessedSnapshot = this._lastSnapshot;

	// 	this.entity.setPosition(this._lastSnapshot!.position[0], this._lastSnapshot!.position[1]);

	// 	let j = 0;
	// 	while (j < this._pendingInputs.length) {
	// 		let input = this._pendingInputs[j];
	// 		if (input.tick < this._lastSnapshot!.tick) {
	// 			this._pendingInputs.splice(j, 1);
	// 		} else {
	// 			this.processMovement(input);
	// 			j++;
	// 		}
	// 	}
	// }

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

		// if (!vec2.equals(this._lastDirection, direction)) {
		const packet = new ServerPackets.PlayerMovePacket(
			this.direction,
			this._inputSequenceNumber,
			dt
		);
		client.sendPacket(packet);

		this._pendingInputs.push({
			direction: this.direction,
			tick: this._inputSequenceNumber,
			delta: dt
		});
		this._inputSequenceNumber++;
		// }

		const newVelocity = processInput(this.direction);
		const predictionSnapshot = processSnapshot(
			{
				position: [this.entity.position.x, this.entity.position.y],
				velocity: newVelocity
			},
			dt
		);

		this.applySnapshot(predictionSnapshot);
	}
}
