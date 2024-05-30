import RAPIER, { RigidBodyDesc } from '@dimforge/rapier2d-compat';
import { Enemy, Player, RoomState } from '@ppog/shared';
import { Client, Room, ServerError } from 'colyseus';
import { v4 } from 'uuid';
import { WorldPhysics } from '../WorldPhysics';
import World from '../assets/worlds/map.json';
import { IncomingMessage } from 'http';
import { prismaClient } from '../app.config';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import CharacterController from '../controllers/character';

export class MainRoom extends Room<RoomState> {
  maxClients: number = 50;
  physics: WorldPhysics;
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

  onCreate(options: any) {
    this.setState(new RoomState());
    const enemy = new Enemy();
    enemy.name = 'Enemy';
    enemy.id = v4();
    enemy.position.x = Math.floor(Math.random() * 100);
    enemy.position.y = Math.floor(Math.random() * 100);
    enemy.velocity.x = 0;
    enemy.velocity.y = 0;

    this.state.entities.set(enemy.id, enemy);

    this.setPatchRate(1000 / 60);

    this.onMessage('move', (client, message) => {
      const entity = this.state.entities.get(client.sessionId);

      if (!entity) return;

      entity.velocity.x = message.x;
      entity.velocity.y = message.y;
    });

    this.physics = new WorldPhysics(this);
    this.physics.runSimulation();
  }

  async onJoin(client: Client, options: any, userData: User) {
    console.log(client.sessionId, 'joined!');

    client.userData = {
      userId: userData.id
    };

    const character = await this.characterController.getUserCharacter(userData.id);

    if (character) {
      console.log(`${client.sessionId} logged in as ${character.name}`);
      
      const player = new Player();
      player.id = client.sessionId;
      player.username = character.name;
      player.position.x = character.x;
      player.position.y = character.y;
      player.velocity.x = 0;
      player.velocity.y = 0;

      const rigidBody = this.physics.world.createRigidBody(RigidBodyDesc.kinematicVelocityBased());
      rigidBody.setTranslation({ x: player.position.x, y: player.position.y }, true);
      rigidBody.userData = client.sessionId;
      this.physics.world.createCollider(
        RAPIER.ColliderDesc.cuboid(player.collisionBox.width / 2, player.collisionBox.height / 2),
        rigidBody
      );

      this.physics.bodies.set(player.id, rigidBody);

      this.state.entities.set(client.sessionId, player);

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

    this.state.entities.delete(client.sessionId);

    this.physics.world.removeRigidBody(this.physics.bodies.get(client.sessionId));
    this.physics.bodies.delete(client.sessionId);
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
