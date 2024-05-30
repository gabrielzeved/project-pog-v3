import { Schema, type } from '@colyseus/schema';
import { Box, Vec2 } from '../types';

export class Entity extends Schema {
  @type('string') id: string;
  @type('int8') type: number;

  @type(Vec2) position = new Vec2();
  @type(Vec2) velocity = new Vec2();

  @type(Box) collisionBox = new Box();
}
