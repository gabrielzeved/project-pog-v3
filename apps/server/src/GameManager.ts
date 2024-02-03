import { Entity } from '@ppog/shared';
import { Server } from './Server';

export class GameManager {
  private entities: Entity[] = [];

  constructor(private server: Server) {}

  getEntity(entityId: string) {
    return this.entities.find((entity) => entity.id === entityId);
  }
}
