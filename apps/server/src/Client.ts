import { ClientPackets, Packet } from '@ppog/shared';
import { DisconnectReason, Socket } from 'socket.io';
import { server } from '.';
import { PlayerEntity } from './entities/PlayerEntity';
import { Logger } from './utils/Logger';

export class Client {
  constructor(
    public socket: Socket,
    public readonly entityId: string
  ) {}

  spawn() {
    const names = ['Gayble', 'Nenemz', 'Kaikans', 'Arzok', 'SrSSS', 'leliys'];

    const entity = new PlayerEntity(
      this.entityId,
      names[~~(Math.random() * names.length)],
      [~~(Math.random() * 750), ~~(Math.random() * 750)],
      [0, 0],
      [0, 0],
      'assets/player/data.json'
    );

    const client = server.getClient(this.entityId);

    if (!client) return;

    Logger.info(`${this.entityId} has joined`);

    // send player info to the player
    client.sendPacket(
      new ClientPackets.PlayerInfoPacket({
        entityId: this.entityId
      })
    );

    server.gameManager.spawnEntity(entity);

    // send spawned entities to the player
    for (let { id, type, name, position, spritePath } of server.gameManager.getAllEntities()) {
      if (id === client.entityId) continue;

      client.sendPacket(
        new ClientPackets.EntitySpawnPacket({ id, type, name, position, spritePath })
      );
    }

    // send connected players list
    server.sendPacketToAll(
      new ClientPackets.PlayerInfoUpdatePacket({ clients: server.getAllClients() })
    );

    Logger.info(`${this.entityId} has joined`);
  }

  setup() {
    this.socket.on('disconnect', (reason: DisconnectReason) => {
      this.disconnect(reason);
    });
    this.socket.onAny((evt, data) => {
      try {
        if (!this.onMessage(evt, data)) {
          Logger.warning(`Unknown command (${evt}), disconnected.`);
          // this.disconnect();
        }
      } catch (err) {
        console.error(err);
      }
    });
    this.spawn();
  }

  onMessage(evt: string, data: any): boolean {
    return server.onPacket(this, evt, data);
  }

  sendPacket(packet: Packet) {
    this.socket.emit(packet.name, packet);
  }

  disconnect(reason = 'unknown') {
    if (this.socket.connected) this.socket.disconnect();
    server.gameManager.destroyEntity(this.entityId);
    server.removeClient(this.entityId);

    // Send connected players to everyone
    server.sendPacketToAllBut(
      new ClientPackets.PlayerInfoUpdatePacket({ clients: server.getAllClients() }),
      this.entityId
    );

    Logger.info(`${this.entityId} has disconnected (reason: ${reason})`);
  }
}
