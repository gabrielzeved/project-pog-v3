import { Enemy, EntityType, Player, RoomState } from '@ppog/shared';
import { Client, Room } from 'colyseus';
import { v4 } from 'uuid';
import { GameManager } from './GameManager';

export class MainRoom extends Room<RoomState> {
  maxClients: number = 50;

  async onCreate(options: any) {
    this.setState(new RoomState());

    await GameManager.getInstance().start(this);

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

    enemy.name = 'Enemy';

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

      for (const entity of entities) {
        entity.velocity.x = 20.0;
        entity.velocity.y = 0.0;
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined!');

    const player = GameManager.getInstance().entityManager.spawn<Player>(EntityType.PLAYER, {
      id: client.sessionId,
      type: EntityType.PLAYER,
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

    player.username = 'Guest';
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');

    const physics = GameManager.getInstance().physics;

    physics.world.removeRigidBody(physics.bodies.get(client.sessionId));
    physics.bodies.delete(client.sessionId);
    this.state.entities.delete(client.sessionId);
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
