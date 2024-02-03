import { Packet, PacketType } from '../../Packet';

export class ChatMessagePacket extends Packet {
  type: PacketType = PacketType.CHAT_MESSAGE;

  constructor(public message: string) {
    super();
  }
}
