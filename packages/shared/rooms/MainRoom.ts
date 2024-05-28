import { MapSchema, Schema, type } from '@colyseus/schema';
import { Entity } from '@ppog/shared';

export class RoomState extends Schema {
  @type({ map: Entity }) entities = new MapSchema<Entity>();
}
