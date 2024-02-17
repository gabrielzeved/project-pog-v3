import { EntityType } from '@ppog/shared';
import { DamagableEntity } from './DamagableEntity';

export class EnemyEntity extends DamagableEntity {
  type: EntityType = EntityType.ENEMY;
}
