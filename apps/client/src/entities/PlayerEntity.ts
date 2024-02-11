import { NetworkEntityComponent } from '../engine/components/NetworkEntityComponent';
import { PlayerControllerComponent } from '../engine/components/PlayerControllerComponent';
import { SpriteComponent } from '../engine/components/SpriteComponent';
import { client } from '../main';
import { GameEntity } from './GameEntity';

export class PlayerEntity extends GameEntity {
	constructor(id: string, playerName: string, spritePath: string) {
		super(playerName);

		this.id = id;

		// Add player components
		this.addComponent(new SpriteComponent(this, spritePath));

		if (this.id === client.entityId) {
			this.addComponent(new PlayerControllerComponent(this, 5));
		} else {
			this.addComponent(new NetworkEntityComponent(this));
		}
	}
}
