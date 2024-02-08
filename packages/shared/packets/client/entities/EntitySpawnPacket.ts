import { Vector2 } from '../../../types';
import { Packet, PacketType } from '../../Packet';

export interface EntitySpawnPacketData {
  id: string;
  name: string;
  position: Vector2;
  spritePath: string;
}

export class EntitySpawnPacket extends Packet {
  type: PacketType = PacketType.ENTITY_SPAWN;

  constructor(public data: EntitySpawnPacketData) {
    super();
  }
}
