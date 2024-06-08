import { Schema, type } from '@colyseus/schema';

export class Vec2 extends Schema {
  @type('number') x: number = 0;
  @type('number') y: number = 0;
}

export class Box extends Schema {
  @type('number') x: number = 0;
  @type('number') y: number = 0;
  @type('number') width: number = 0;
  @type('number') height: number = 0;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}
