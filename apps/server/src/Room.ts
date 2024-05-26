import { MapSchema, Schema, type } from '@colyseus/schema';
import { Client, Room } from 'colyseus';

export class Player extends Schema {
  @type('string') username: string;
  @type('number') x: number;
  @type('number') y: number;
}

export class RoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

export class MainRoom extends Room<RoomState> {
  maxClients: number = 50;

  onCreate(options: any) {
    this.setState(new RoomState());

    // this.setPatchRate(1000 / 60);

    this.onMessage('move', (client, message) => {
      const player = this.state.players.get(client.sessionId);

      if (player) {
        player.x = message.x;
        player.y = message.y;
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined!');
    const player = new Player();
    player.username = 'Guest';
    player.x = Math.floor(Math.random() * 100);
    player.y = Math.floor(Math.random() * 100);
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');
    // this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
