import { Packet, PacketType } from '../../Packet';

export class EntityDestroyPacket extends Packet {
  type: PacketType = PacketType.ENTITY_DESTROY;

  constructor(public entityId: string) {
    super();
  }
}
