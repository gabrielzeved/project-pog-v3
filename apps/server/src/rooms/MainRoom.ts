import { Enemy, EntityType, MainRoomState, Player } from '@ppog/shared';
import { User } from '@prisma/client';
import { Client, Room, ServerError } from 'colyseus';
import { IncomingMessage } from 'http';
import * as jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { GameManager } from '../GameManager';
import { prismaClient } from '../app.config';
import World from '../assets/worlds/map.json';
import CharacterController from '../controllers/character';

export class MainRoom extends Room<MainRoomState> {
  maxClients: number = 50;
  characterController = new CharacterController();

  /* Executes before onJoin */
  static async onAuth(token: string, req: IncomingMessage) {
    if (!token) {
      throw new ServerError(400, 'Not authenticated');
    }

    const payload = jwt.verify(token!, process.env.JWT_SECRET!) as any;

    const user = await prismaClient.user.findFirst({
      where: {
        id: payload.userId
      }
    });

    if (!user) {
      throw new ServerError(400, 'Not authenticated');
    }

    delete user.password;
    return user;
  }

  async onCreate(options: any) {
    this.setState(new MainRoomState());

    await GameManager.getInstance().start(this);

    this.setSimulationInterval((dt) => {
      GameManager.getInstance().loop(dt);
    });

    const enemy = GameManager.getInstance().entityManager.spawn<Enemy>(EntityType.ENEMY, {
      id: v4(),
      type: EntityType.ENEMY,
      position: {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100)
      },
      velocity: {
        x: 0,
        y: 0
      },
      collisionBox: {
        h: 32,
        w: 32,
        x: 0,
        y: 0
      }
    });

    this.setPatchRate(1000 / 60);

    this.onMessage('move', (client, message) => {
      const entity = this.state.entities.get(client.sessionId);

      if (!entity) return;

      entity.velocity.x = message.x;
      entity.velocity.y = message.y;
    });

    this.onMessage('attack', (client, message) => {
      const body = GameManager.getInstance().physics.bodies.get(client.sessionId);

      if (!body) return;

      const entities = GameManager.getInstance().physics.boxCast(
        body.translation(),
        { x: 32.0, y: 32.0 },
        body
      );
    });
  }

  async onJoin(client: Client, options: any, userData: User) {
    console.log(client.sessionId, 'joined!');

    client.userData = {
      userId: userData.id
    };

    const character = await this.characterController.getUserCharacter(userData.id);

    if (character) {
      console.log(`${client.sessionId} logged in as ${character.name}`);

      const player = GameManager.getInstance().entityManager.spawn<Player>(EntityType.PLAYER, {
        id: client.sessionId,
        type: EntityType.PLAYER,
        position: {
          x: character.x,
          y: character.y
        },
        velocity: {
          x: 0,
          y: 0
        },
        collisionBox: {
          h: 32,
          w: 32,
          x: 0,
          y: 0
        }
      });

      player.username = character.name;

      client.send('WorldLoad', World);
    } else {
      // todo: handle no character error
    }
  }

  async onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');

    const player = this.state.entities.get(client.sessionId) as Player;
    const character = await this.characterController.getUserCharacter(client.userData.userId);

    if (character) {
      await this.characterController.updateCharacter(character.id, {
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

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
