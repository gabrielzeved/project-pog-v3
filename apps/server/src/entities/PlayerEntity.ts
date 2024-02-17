import { EntityType } from '@ppog/shared';
import { WorldEntity } from './WorldEntity';

export class PlayerEntity extends WorldEntity {
  type: EntityType = EntityType.PLAYER;

  public lastInputSequenceNumber: number = 0;

  start(): void {}
  update(dt: number) {}
}
