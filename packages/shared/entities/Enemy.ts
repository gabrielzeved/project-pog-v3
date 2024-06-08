import { type } from '@colyseus/schema';
import { DamagableEntity } from './DamagableEntity';
import { EntityType } from './EntityType';

export class Enemy extends DamagableEntity {
  @type('string') name: string;

  constructor(...args: any[]) {
    super(args);
    this.type = EntityType.ENEMY;

    this.maxHealth = 10;
    this.health = this.maxHealth;

    this.collisionBox.x = 0;
    this.collisionBox.y = 0;
    this.collisionBox.width = 32;
    this.collisionBox.height = 16;
  }
}
