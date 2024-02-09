import { ChatMessagePacket } from './chat';
import { PlayerInfoPacket, PlayerInfoUpdatePacket } from './player';
import { EntitySpawnPacket, EntityDestroyPacket } from './entities';

export const ClientPackets = {
  PlayerInfoPacket,
  PlayerInfoUpdatePacket,
  ChatMessagePacket,
  EntitySpawnPacket,
  EntityDestroyPacket
};
