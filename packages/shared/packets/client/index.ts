import { ChatMessagePacket } from './chat';
import { EntityDestroyPacket, EntitySpawnPacket } from './entities';
import { EntitySnapshotPacket } from './entities/EntitySnapshotPacket';
import { PlayerInfoPacket, PlayerInfoUpdatePacket } from './player';
import { WorldLoadPacket } from './world';

export const ClientPackets = {
  PlayerInfoPacket,
  PlayerInfoUpdatePacket,
  ChatMessagePacket,
  EntitySpawnPacket,
  EntityDestroyPacket,
  EntitySnapshotPacket,
  WorldLoadPacket
};
