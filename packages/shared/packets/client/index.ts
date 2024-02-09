import { ChatMessagePacket } from './chat';
import { EntityDestroyPacket, EntitySpawnPacket } from './entities';
import { EntityMovePacket } from './entities/EntityMovePacket';
import { PlayerInfoPacket, PlayerInfoUpdatePacket } from './player';

export const ClientPackets = {
  PlayerInfoPacket,
  PlayerInfoUpdatePacket,
  ChatMessagePacket,
  EntitySpawnPacket,
  EntityDestroyPacket,
  EntityMovePacket
};
