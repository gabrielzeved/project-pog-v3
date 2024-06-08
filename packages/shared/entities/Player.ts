import { type } from '@colyseus/schema';
import { ActionType } from '../actions/ActionType';
import { DamagableEntity } from './DamagableEntity';
import { EntityType } from './EntityType';

export class Player extends DamagableEntity {
  @type('string') username: string;
  @type('int8') currentAction: ActionType = ActionType.NONE;

  constructor(...args: any[]) {
    super(args);
    this.type = EntityType.PLAYER;

    this.maxHealth = 20;
    this.health = 10;

    this.collisionBox.x = 0;
    this.collisionBox.y = 0;
    this.collisionBox.width = 32;
    this.collisionBox.height = 32;
  }
}
