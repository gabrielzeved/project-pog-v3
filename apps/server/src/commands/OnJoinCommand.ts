import { Command } from '@colyseus/command';
import { EntityType, Player } from '@ppog/shared';
import { User } from '@prisma/client';
import { Client } from 'colyseus';
import { GameManager } from '../GameManager';
import World from '../assets/worlds/map.json';
import CharacterController from '../controllers/character';
import { MainRoom } from '../rooms';

export interface OnJoinCommandProps {
  client: Client;
  characterController: CharacterController;
  user: User;
}

export class OnJoinCommand extends Command<MainRoom, OnJoinCommandProps> {
  async execute({ client, characterController, user }: OnJoinCommandProps) {
    const id = client.sessionId;

    console.log(id, 'joined!');

    client.userData = {
      userId: user.id
    };

    const character = await characterController.getUserCharacter(user.id);

    if (character) {
      console.log(`${client.sessionId} logged in as ${character.name}`);

      const player = GameManager.getInstance().entityManager.spawn<Player>(EntityType.PLAYER, {
        id: client.sessionId,
        type: EntityType.PLAYER,
        position: {
          x: character.x,
          y: character.y
        }
      });

      player.username = character.name;

      client.send('WorldLoad', World);
    } else {
      // todo: handle no character error
    }
  }
}
