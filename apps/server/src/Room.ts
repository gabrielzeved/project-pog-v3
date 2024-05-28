import RAPIER, { RigidBodyDesc } from '@dimforge/rapier2d-compat';
import { Enemy, Player, RoomState } from '@ppog/shared';
import { Client, Room } from 'colyseus';
import { v4 } from 'uuid';
import { WorldPhysics } from './WorldPhysics';

export class MainRoom extends Room<RoomState> {
  maxClients: number = 50;
  physics: WorldPhysics;

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

    // this.setPatchRate(1000 / 60);

    this.onMessage('move', (client, message) => {
      const entity = this.state.entities.get(client.sessionId);

      if (!entity) return;

      entity.velocity.x = message.x;
      entity.velocity.y = message.y;
    });

    this.physics = new WorldPhysics(this);
    this.physics.runSimulation();
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined!');

    const player = new Player();
    player.username = 'Guest';
    player.id = client.sessionId;
    player.position.x = Math.floor(Math.random() * 100);
    player.position.y = Math.floor(Math.random() * 100);
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
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');
    this.state.entities.delete(client.sessionId);

    this.physics.world.removeRigidBody(this.physics.bodies.get(client.sessionId));
    this.physics.bodies.delete(client.sessionId);
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
