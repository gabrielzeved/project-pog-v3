import { Enemy, Player, RoomState } from '@ppog/shared';
import { Client, Room } from 'colyseus';
import { v4 } from 'uuid';

export class MainRoom extends Room<RoomState> {
  maxClients: number = 50;

  onCreate(options: any) {
    this.setState(new RoomState());

    const enemy = new Enemy();
    enemy.name = 'Enemy';
    enemy.id = v4();
    enemy.position.x = Math.floor(Math.random() * 100);
    enemy.position.y = Math.floor(Math.random() * 100);
    this.state.entities.set(enemy.id, enemy);

    // this.setPatchRate(1000 / 60);

    this.onMessage('move', (client, message) => {
      const player = this.state.entities.get(client.sessionId);

      if (player) {
        player.position.x = message.x;
        player.position.y = message.y;
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined!');
    const player = new Player();
    player.username = 'Guest';
    player.id = client.sessionId;
    player.position.x = Math.floor(Math.random() * 100);
    player.position.y = Math.floor(Math.random() * 100);

    this.state.entities.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');
    this.state.entities.delete(client.sessionId);
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
