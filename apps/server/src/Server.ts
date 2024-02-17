import { Packet } from '@ppog/shared';
import { Server as SocketServer } from 'socket.io';
import { v4 } from 'uuid';
import { Client } from './Client';
import { GameManager } from './GameManager';

import { TPS } from '@ppog/shared';
import { handlePacket } from './PacketHandler';

interface ServerConfig {
  tps: number;
}

interface QueueNode {
  packet: Packet;
  client: Client;
}

export class Server {
  private clients: Map<string, Client> = new Map();
  public gameManager: GameManager = new GameManager(this);
  private queue: QueueNode[] = [];

  private get tpms(): number {
    return 1000 / this.config.tps;
  }

  constructor(
    public socket: SocketServer,
    public config: ServerConfig = {
      tps: TPS
    }
  ) {
    this.setup();
  }

  removeClient(id: string) {
    this.clients.delete(id);
  }

  getClient(id: string) {
    return this.clients.get(id);
  }

  sendPacketToAll(packet: Packet) {
    this.socket.emit(packet.name, packet);
  }

  sendPacketToAllBut(packet: Packet, id: string) {
    this.clients.forEach((client) => {
      if (client.entityId !== id) client.sendPacket(packet);
    });
  }

  getAllClients(): string[] {
    return Array.from(this.clients.keys());
  }

  setup() {
    this.socket.on('connection', (socketClient) => {
      const id = v4();
      const client = new Client(socketClient, id);
      this.clients.set(id, client);
      client.setup();
    });
  }

  queuePacket(packet: Packet, client: Client) {
    this.queue.push({
      packet,
      client
    });
  }

  processPackets() {
    let currentPacket: QueueNode | undefined;
    while ((currentPacket = this.queue.pop())) {
      if (!currentPacket) break;
      handlePacket(currentPacket.packet, currentPacket.client);
    }
  }

  onPacket(client: Client, evt: string, data: any): boolean {
    this.queuePacket(data, client);
    return true;
  }

  run() {
    const t1 = performance.now();
    this.loop(t1);
  }

  loop(t1: number) {
    let t2 = performance.now();
    setTimeout(() => {
      this.loop(t2);
    }, this.tpms);
    const delta = (t2 - t1) * 0.001;
    this.processPackets();
    this.gameManager.update(delta);
  }
}
