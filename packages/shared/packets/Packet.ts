export enum PacketType {
  CHAT_MESSAGE = 'chat.message',
  PLAYER_CHAT_MESSAGE = 'player.chat.message'
}

export abstract class Packet {
  abstract readonly type: PacketType;

  get name(): string {
    return this.type;
  }
}
