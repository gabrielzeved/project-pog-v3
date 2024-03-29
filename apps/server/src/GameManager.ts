import { ClientPackets } from '@ppog/shared';
import { EntitySnapshotPacket } from '@ppog/shared/packets/client/entities/EntitySnapshotPacket';
import { Server } from './Server';
import { PlayerEntity } from './entities/PlayerEntity';
import { WorldEntity } from './entities/WorldEntity';
export class GameManager {
  private entities: WorldEntity[] = [];
  public tick: number = 0;

  constructor(private server: Server) {}

  getAllEntities() {
    return this.entities;
  }

  getEntity(entityId: string) {
    return this.entities.find((entity) => entity.id === entityId);
  }

  spawnEntity<T extends WorldEntity = WorldEntity>(entity: T): T {
    this.entities.push(entity);

    this.server.sendPacketToAll(
      new ClientPackets.EntitySpawnPacket({
        id: entity.id,
        type: entity.type,
        name: entity.name,
        position: entity.position,
        spritePath: entity.spritePath
      })
    );

    return entity;
  }

  destroyEntity(entityId: string) {
    // this.server.queueEvent(new EntityDestroyEvent(entityId));

    const index = this.entities.findIndex((entity) => entity.id === entityId);
    const entity = this.entities[index];

    if (!entity) return;

    this.server.sendPacketToAll(new ClientPackets.EntityDestroyPacket(entity.id));

    this.entities.splice(index, 1);
  }

  update(dt: number) {
    this.tick++;
    for (const entity of this.entities) {
      entity.update(dt);

      this.server.sendPacketToAll(
        new EntitySnapshotPacket({
          id: entity.id,
          position: entity.position,
          velocity: entity.velocity,
          tick: entity instanceof PlayerEntity ? entity.lastInputSequenceNumber : 0
        })
      );
    }
  }
}
