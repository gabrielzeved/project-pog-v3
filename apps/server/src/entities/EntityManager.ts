import RAPIER from '@dimforge/rapier2d-compat';
import { Enemy, Entity, EntityType, Player } from '@ppog/shared';
import { GameManager } from '../GameManager';

export type EntitySpawnOptions = {
  position?: {
    x: number;
    y: number;
  };
  velocity?: {
    x: number;
    y: number;
  };
  collisionBox?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  id?: string;
  type?: number;
};

export type EntityConstructor = { new (...args: any[]): Entity };

export const EntityMap: Record<EntityType, EntityConstructor> = {
  [EntityType.PLAYER]: Player,
  [EntityType.ENEMY]: Enemy
};

export class EntityManager {
  get(id: string): Entity {
    return GameManager.getInstance().room.state.entities.get(id);
  }

  spawn<T extends Entity>(type: EntityType, options: EntitySpawnOptions): T {
    const entity = new EntityMap[type]();
    entity.id = options.id;
    entity.position.x = options.position?.x;
    entity.position.y = options.position?.y;
    entity.velocity.x = options.velocity?.x ?? entity.velocity?.x;
    entity.velocity.y = options.velocity?.y ?? entity.velocity?.y;
    entity.collisionBox.x = options.collisionBox?.x ?? entity.collisionBox.x;
    entity.collisionBox.y = options.collisionBox?.y ?? entity.collisionBox.y;
    entity.collisionBox.width = options.collisionBox?.w ?? entity.collisionBox.width;
    entity.collisionBox.height = options.collisionBox?.h ?? entity.collisionBox.height;
    entity.type = options.type;

    const physics = GameManager.getInstance().physics;
    const room = GameManager.getInstance().room;

    const rigidBody = physics.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic());
    rigidBody.setTranslation({ x: entity.position.x, y: entity.position.y }, true);
    rigidBody.userData = entity.id;
    physics.world.createCollider(
      RAPIER.ColliderDesc.cuboid(entity.collisionBox.width / 2, entity.collisionBox.height / 2),
      rigidBody
    );
    rigidBody.setLinearDamping(0.8);

    physics.bodies.set(entity.id, rigidBody);
    room.state.entities.set(entity.id, entity);

    return entity as T;
  }
}
