import { type } from '@colyseus/schema';
import { Entity } from './Entity';
import { EntityType } from './EntityType';

export class Enemy extends Entity {
  @type('string') name: string;

  constructor(...args: any[]) {
    super(args);
    this.type = EntityType.ENEMY;

    this.collisionBox.x = 0;
    this.collisionBox.y = 0;
    this.collisionBox.width = 32;
    this.collisionBox.height = 16;
  }
}
