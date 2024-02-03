import { Packet, PacketType } from '../../Packet';

export class ChatMessagePacket extends Packet {
  type: PacketType = PacketType.CHAT_MESSAGE;

  constructor(
    public userId: string,
    public message: string
  ) {
    super();
  }
}
