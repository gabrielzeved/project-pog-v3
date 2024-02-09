import { Entity } from '../../../entities';
import { Packet, PacketType } from '../../Packet';

export class EntitySpawnPacket extends Packet {
  type: PacketType = PacketType.ENTITY_SPAWN;

  constructor(public entity: Entity) {
    super();
  }
}
