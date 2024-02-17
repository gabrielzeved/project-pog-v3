import { EntityType } from '@ppog/shared';
import { EnemyEntity } from './EnemyEntity';
import { PlayerEntity } from './PlayerEntity';
import { WorldEntity } from './WorldEntity';

export const EntityConstructor: Record<EntityType, Newable<WorldEntity>> = {
  [EntityType.PLAYER]: PlayerEntity,
  [EntityType.ENEMY]: EnemyEntity
};
