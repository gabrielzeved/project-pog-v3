import { WorldEntity } from './WorldEntity';

export class PlayerEntity extends WorldEntity {
  public lastInputSequenceNumber: number = 0;

  override update(dt: number) {}
}
