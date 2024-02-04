import { Packet, PacketType, Player } from '@ppog/shared';
import { Server as SocketServer } from 'socket.io';
import { v4 } from 'uuid';
import { Client } from './Client';
import { GameManager } from './GameManager';
import { Event } from './events/Event';
import { EventQueue } from './events/EventQueue';
import { EventClass, ListenerFunction } from './listeners/Listener';

import { PlayerChatEvent } from './events/chat';
import { PlayerDisconnectEvent, PlayerJoinEvent } from './events/player';

import { PlayerChatEventListener } from './listeners/chat/ChatMessageListener';
import { PlayerDisconnectEventListener } from './listeners/player/PlayerDisconnectListener';
import { PlayerJoinEventListener } from './listeners/player/PlayerJoinListener';
import { Logger } from './utils/Logger';

interface ServerConfig {
  tps: number;
}

export class Server {
  private clients: Map<string, Client> = new Map();
  private eventQueue: EventQueue = new EventQueue();
  private listeners: Map<EventClass, ListenerFunction[]> = new Map();
  private gameManager: GameManager = new GameManager(this);

  private get tpms(): number {
    return this.config.tps / 1000;
  }

  constructor(
    public socket: SocketServer,
    public config: ServerConfig = {
      tps: 30
    }
  ) {
    this.setup();
    this.setupListeners();
  }

  removeClient(id: string) {
    this.clients.delete(id);
  }

  getClient(id: string) {
    return this.clients.get(id);
  }

  sendPacketToAll(packet: Packet) {
    this.clients.forEach((client) => {
      client.sendPacket(packet);
    });
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

  setupListeners() {
    this.addListener(PlayerJoinEvent, PlayerJoinEventListener);
    this.addListener(PlayerDisconnectEvent, PlayerDisconnectEventListener);
    this.addListener(PlayerChatEvent, PlayerChatEventListener);
  }

  addListener(evt: EventClass, listener: ListenerFunction) {
    if (!this.listeners.has(evt)) this.listeners.set(evt, []);
    this.listeners.get(evt)!.push(listener);
  }

  queueEvent(event: Event) {
    this.eventQueue.push(event);
  }

  processEvents() {
    let currentEvent: Event | undefined;
    while ((currentEvent = this.eventQueue.pop())) {
      if (!currentEvent) break;

      const newable = Object.getPrototypeOf(currentEvent).constructor;
      if (this.listeners.has(newable)) {
        this.listeners.get(newable)!.forEach((listener) => {
          Logger.info(`${currentEvent!.name} event handled!`);
          listener(currentEvent);
        });
      }
    }
  }

  onPacket(client: Client, evt: string, data: any): boolean {
    switch (evt) {
      case PacketType.CHAT_MESSAGE:
        this.queueEvent(new PlayerChatEvent(new Player(client.entityId), data.message));
        break;
      default:
        return false;
    }

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
    // const delta = (t2 - t1) * 0.001;
    this.processEvents();
  }
}
