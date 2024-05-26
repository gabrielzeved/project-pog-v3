import { type } from '@colyseus/schema';
import { Entity } from './Entity';
import { EntityType } from './EntityType';

export class Player extends Entity {
  @type('string') username: string;

  constructor(...args: any[]) {
    super(args);
    this.type = EntityType.PLAYER;

    this.collisionBox.x = 0;
    this.collisionBox.y = 0;
    this.collisionBox.width = 32;
    this.collisionBox.height = 32;
  }
}
