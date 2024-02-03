import { Packet } from '@ppog/shared';
import { Socket } from 'socket.io';
import { server } from '.';
import { PlayerDisconnectEvent, PlayerJoinEvent } from './events/player';

export class Client {
  constructor(
    public socket: Socket,
    public readonly entityId: string
  ) {
    server.queueEvent(new PlayerJoinEvent(entityId));
  }

  setup() {
    this.socket.on('disconnect', () => {
      this.disconnect();
    });
    this.socket.onAny((evt, data) => {
      try {
        if (!this.onMessage(evt, data)) {
          console.log('Unknown command (' + evt + '), disconnected.');
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
