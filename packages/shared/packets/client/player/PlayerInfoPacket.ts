import { Packet, PacketType } from '../../Packet';

export interface PlayerInfoPacketData {
  entityId: string;
}

export class PlayerInfoPacket extends Packet {
  type: PacketType = PacketType.PLAYER_INFO;

  constructor(public data: PlayerInfoPacketData) {
    super();
  }
}
