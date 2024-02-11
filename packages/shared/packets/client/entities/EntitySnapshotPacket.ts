import { vec2 } from 'gl-matrix';
import { Packet, PacketType } from '../../Packet';

export interface EntitySnapshotPacketData {
  id: string;
  tick: number;
  position: vec2;
  velocity: vec2;
}

export class EntitySnapshotPacket extends Packet {
  type: PacketType = PacketType.ENTITY_SNAPSHOT;

  constructor(public data: EntitySnapshotPacketData) {
    super();
  }
}
