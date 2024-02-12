import { AnimatedSpriteComponent } from '../engine/components/AnimatedSpriteComponent';
import { CharacterAnimationComponent } from '../engine/components/CharacterAnimationComponent';
import { NetworkEntityComponent } from '../engine/components/NetworkEntityComponent';
import { PlayerControllerComponent } from '../engine/components/PlayerControllerComponent';
import { client } from '../main';
import { GameEntity } from './GameEntity';

export class PlayerEntity extends GameEntity {
	constructor(id: string, playerName: string, spritesheetPath: string) {
		super(playerName);

		this.id = id;

		// Add player components

		const sprite = new AnimatedSpriteComponent(this, 'IdleSouth', 0.3, spritesheetPath);
		this.addComponent(sprite);

		this.addComponent(new CharacterAnimationComponent(this));

		if (this.id === client.entityId) {
			this.addComponent(new PlayerControllerComponent(this, 5));
		} else {
			this.addComponent(new NetworkEntityComponent(this));
		}
	}
}
