import { MapSchema, Schema, type } from '@colyseus/schema';
import { Player } from '@ppog/shared';

export class RoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
