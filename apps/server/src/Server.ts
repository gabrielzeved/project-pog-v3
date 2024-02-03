import { ChatMessagePacket, PacketType } from '@ppog/shared';
import { Server as SocketServer } from 'socket.io';
import { v4 } from 'uuid';
import { Client } from './Client';
import { ChatMessagePacketListener } from './listeners/chat/ChatMessageListener';

interface ServerConfig {}

export class Server {
  private clients: Map<String, Client> = new Map();

  constructor(
    public socket: SocketServer,
    public config: ServerConfig
  ) {}

  setup() {
    this.socket.on('connection', (socketClient) => {
      const id = v4();
      const client = new Client(socketClient);
      this.clients.set(id, client);
      client.setup();
    });
  }

  onMessage(evt: string, data: any): boolean {
    switch (evt) {
      case PacketType.CHAT_MESSAGE:
        ChatMessagePacketListener(data as ChatMessagePacket);
        break;
      default:
        return false;
    }
    return true;
  }
}
