export { EntityType } from './EntityType';
import { Schema, type } from '@colyseus/schema';
import { Vec2 } from '../types';

export class Player extends Schema {
  @type('string') username: string;
  @type(Vec2) position = new Vec2();
}
