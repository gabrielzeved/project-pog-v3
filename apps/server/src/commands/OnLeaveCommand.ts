import { Command } from '@colyseus/command';
import { Player } from '@ppog/shared';
import { Client } from 'colyseus';
import { GameManager } from '../GameManager';
import CharacterController from '../controllers/character';
import { MainRoom } from '../rooms';

export interface OnLeaveCommandProps {
  client: Client;
  characterController: CharacterController;
}

export class OnLeaveCommand extends Command<MainRoom, OnLeaveCommandProps> {
  async execute({ client, characterController }: OnLeaveCommandProps) {
    console.log(client.sessionId, 'left!');

    const player = this.state.entities.get(client.sessionId) as Player;
    const character = await characterController.getUserCharacter(client.userData.userId);

    if (character) {
      await characterController.updateCharacter(character.id, {
        name: player.username,
        x: player.position.x,
        y: player.position.y
      });
    }

    const physics = GameManager.getInstance().physics;

    GameManager.getInstance().physics.world.removeRigidBody(physics.bodies.get(client.sessionId));
    physics.bodies.delete(client.sessionId);

    this.state.entities.delete(client.sessionId);
  }
}
