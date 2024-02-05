import { Entity } from '@ppog/shared';
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
}
