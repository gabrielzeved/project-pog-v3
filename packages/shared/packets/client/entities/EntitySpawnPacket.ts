import { vec2 } from 'gl-matrix';
import { Packet, PacketType } from '../../Packet';

export interface EntitySpawnPacketData {
  id: string;
  name: string;
  position: vec2;
  spritePath: string;
}

export class EntitySpawnPacket extends Packet {
  type: PacketType = PacketType.ENTITY_SPAWN;

  constructor(public data: EntitySpawnPacketData) {
    super();
  }
}
