import { Packet } from '@ppog/shared';
import { DisconnectReason, Socket } from 'socket.io';
import { server } from '.';
import { PlayerDisconnectEvent, PlayerJoinEvent } from './events/player';
import { Logger } from './utils/Logger';

export class Client {
  constructor(
    public socket: Socket,
    public readonly entityId: string
  ) {
    server.queueEvent(new PlayerJoinEvent(entityId));
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
  }

  onMessage(evt: string, data: any): boolean {
    return server.onPacket(this, evt, data);
  }

  sendPacket(packet: Packet) {
    this.socket.emit(packet.name, packet);
  }

  disconnect(reason = 'unknown') {
    if (this.socket.connected) this.socket.disconnect();
    server.queueEvent(new PlayerDisconnectEvent(this.entityId, reason));
  }
}
