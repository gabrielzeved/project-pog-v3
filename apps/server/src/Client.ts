import { Packet } from '@ppog/shared';
import { Socket } from 'socket.io';
import { server } from '.';

export class Client {
  constructor(
    public socket: Socket,
    public readonly entityId: string
  ) {}

  setup() {
    this.socket.on('disconnect', () => {
      this.disconnect();
    });
    this.socket.onAny((evt, data) => {
      try {
        if (!this.onMessage(evt, data)) {
          console.log('Unknown command (' + evt + ').');
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

  disconnect() {
    if (this.socket.connected) this.socket.disconnect();
    // this.server.queueEvent(new PlayerDisconnectEvent(this.id, this.entityId));
  }
}
