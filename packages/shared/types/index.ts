import { Schema, type } from '@colyseus/schema';

export class Vec2 extends Schema {
  @type('number') x: number;
  @type('number') y: number;
}

export class Box extends Schema {
  @type('number') x: number;
  @type('number') y: number;
  @type('number') width: number;
  @type('number') height: number;
}
