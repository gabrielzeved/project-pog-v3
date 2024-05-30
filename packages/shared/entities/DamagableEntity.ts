import { type } from '@colyseus/schema';
import { Entity } from "./Entity";

export class DamagableEntity extends Entity {
  @type('int8') maxHealth: number;
  @type('int8') health: number;
}