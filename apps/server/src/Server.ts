import { Server as SocketServer } from 'socket.io';
import { v4 } from 'uuid';
import { Client } from './Client';

interface ServerConfig {
  tps: number;
}

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
    });
  }
}
