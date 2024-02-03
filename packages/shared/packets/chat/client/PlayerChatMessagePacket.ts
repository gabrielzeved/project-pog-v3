import { Packet, PacketType } from '../../Packet';

export class PlayerChatMessagePacket extends Packet {
  type: PacketType = PacketType.PLAYER_CHAT_MESSAGE;

  constructor(
    public userId: string,
    public message: string,
    public timestamp: number
  ) {
    super();
  }
}
