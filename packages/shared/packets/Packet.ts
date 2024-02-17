export enum PacketType {
  CHAT_MESSAGE = 'chat.message',

  PLAYER_INFO = 'player.info',
  PLAYER_INFO_UPDATE = 'player.info.update',
  PLAYER_MOVE = 'player.move',

  ENTITY_SNAPSHOT = 'entity.snapshot',
  ENTITY_SPAWN = 'entity.spawn',
  ENTITY_DESTROY = 'entity.destroy',
  ENTITY_UPDATE_ATTRIBUTES = 'entity.update-attributes',

  WORLD_LOAD = 'world.load'
}

export abstract class Packet {
  abstract readonly type: PacketType;

  get name(): string {
    return this.type;
  }
}
