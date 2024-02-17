import { Packet, PacketType } from '../../Packet';

export class EntityUpdateAttributesPacket extends Packet {
  type: PacketType = PacketType.ENTITY_UPDATE_ATTRIBUTES;

  constructor(
    public entityId: string,
    public health: number,
    public maxHealth: number
  ) {
    super();
  }
}
