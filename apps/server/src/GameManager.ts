import { ClientPackets, Entity } from '@ppog/shared';
import { Server } from './Server';
export class GameManager {
  private entities: Entity[] = [];

  constructor(private server: Server) {}

  getAllEntities() {
    return this.entities;
  }

  getEntity(entityId: string) {
    return this.entities.find((entity) => entity.id === entityId);
  }

  spawnEntity(entity: Entity) {
    this.entities.push(entity);
    return this.entities[this.entities.length - 1];
  }

  destroyEntity(entityId: string) {
    // this.server.queueEvent(new EntityDestroyEvent(entityId));
    const index = this.entities.findIndex((entity) => entity.id === entityId);
    const entity = this.entities[index];

    this.server.sendPacketToAll(new ClientPackets.EntityDestroyPacket(entity.id));

    this.entities.splice(index, 1);
  }
}
