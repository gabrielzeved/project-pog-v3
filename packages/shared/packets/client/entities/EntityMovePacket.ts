import { vec2 } from 'gl-matrix';
import { Packet, PacketType } from '../../Packet';

export interface EntityMovePacketData {
  id: string;
  from: vec2;
  to: vec2;
}

export class EntityMovePacket extends Packet {
  type: PacketType = PacketType.ENTITY_MOVE;

  constructor(public data: EntityMovePacketData) {
    super();
  }
}
