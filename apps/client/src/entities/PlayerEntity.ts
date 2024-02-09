import { SpriteComponent } from '../engine/components/SpriteComponent';
import { client } from '../main';
import { GameEntity } from './GameEntity';

export class PlayerEntity extends GameEntity {
	constructor(playerName: string, spritePath: string) {
		super(playerName);

		// Add player components
		this.addComponent(new SpriteComponent(this, spritePath));

		if (this.id === client.entityId) {
			// this.addComponent(new PlayerControllerComponent());
		} else {
			// this.addComponent(new NetworkEntityController());
		}
	}
}
