import { Packet, PacketType } from '../../Packet';

export interface PlayerInfoUpdatePacketData {
  clients: string[];
}

export class PlayerInfoUpdatePacket extends Packet {
  type: PacketType = PacketType.PLAYER_INFO_UPDATE;

  constructor(public data: PlayerInfoUpdatePacketData) {
    super();
  }
}
