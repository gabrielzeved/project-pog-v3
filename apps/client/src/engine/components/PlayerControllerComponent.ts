import { ActionType } from '@ppog/shared/actions/ActionType';
import { vec2 } from 'gl-matrix';
import type { PlayerEntity } from '../../entities/PlayerEntity';
import { gameApp } from '../../main';
import { MouseButton } from '../InputMouseManager';
import type { CharacterAnimationComponent } from './CharacterAnimationComponent';
import { Component, ComponentNames } from './Component';

export class PlayerControllerComponent extends Component {
	private speed: number;
	public direction: vec2 = [0, 0];
	private _lastDirection: vec2 = [0, 0];

	constructor(player: PlayerEntity, speed: number) {
		super(player, ComponentNames.PlayerController);
		this.speed = speed;
	}

	updateCamera() {
		const zoomLevel = 1;
		const ease = 1;
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		const cameraX = this.entity.position.x * zoomLevel - screenWidth / 2;
		const cameraY = this.entity.position.y * zoomLevel - screenHeight / 2;

		const maxX = gameApp.app.stage.width - screenWidth; // / 4
		const maxY = gameApp.app.stage.height - screenHeight; // / 4

		let futureX = Math.max(0, Math.min(cameraX, maxX));
		gameApp.app.stage.x = -Math.mix(gameApp.app.stage.x, futureX, ease);

		let futureY = Math.max(0, Math.min(cameraY, maxY));
		gameApp.app.stage.y = -Math.mix(gameApp.app.stage.y, futureY, ease);

		gameApp.app.stage.scale.set(zoomLevel);
	}

	update(dt: number) {
		this.updateCamera();

		const input = gameApp.keyboardManager;
		const mouse = gameApp.mouseManager;

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

		if (mouse.isButtonDown(MouseButton.LEFT)) {
			gameApp.room.send('attack', ActionType.SLASH);
		}

		vec2.normalize(this.direction, direction);

		gameApp.room.send('move', {
			x: this.direction[0] * this.speed,
			y: this.direction[1] * this.speed
		});

		this.entity
			.getComponent<CharacterAnimationComponent>(ComponentNames.CharacterAnimation)
			?.updateDirection(this.direction);
	}
}
