export enum PacketType {
  CHAT_MESSAGE,
  PLAYER_CHAT_MESSAGE
}

export abstract class Packet {
  abstract readonly type: PacketType;
}
