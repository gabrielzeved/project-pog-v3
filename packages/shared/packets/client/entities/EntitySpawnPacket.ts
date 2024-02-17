import { vec2 } from 'gl-matrix';
import { EntityType } from '../../../entities';
import { Packet, PacketType } from '../../Packet';

export interface EntitySpawnPacketData {
  id: string;
  type: EntityType;
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
