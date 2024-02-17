import {
  Packet,
  PacketType,
  ServerPackets,
  TPS,
  processInput,
  processSnapshot
} from '@ppog/shared';
import { ChatMessagePacket } from '@ppog/shared/packets/server/chat';
import { PlayerMovePacket } from '@ppog/shared/packets/server/player/PlayerMovePacket';
import { vec2 } from 'gl-matrix';
import { server } from '.';
import { Client } from './Client';
import { PlayerEntity } from './entities/PlayerEntity';

export type PacketHandler<T extends Packet> = (packet: T, client: Client) => void;

export type ServerPackets = keyof typeof ServerPackets;

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

const PacketHandlers: PartialRecord<PacketType, PacketHandler<any>> = {
  [PacketType.CHAT_MESSAGE]: onChatMessage,
  [PacketType.PLAYER_MOVE]: onPlayerMove
};

export function handlePacket(packet: Packet, client: Client) {
  const handler = PacketHandlers[packet.type];
  handler?.(packet, client);
}

function onChatMessage(packet: ChatMessagePacket, client: Client) {
  console.log(`${client.entityId} : ${packet.message}`);
}

export function onPlayerMove(packet: PlayerMovePacket, client: Client) {
  const entity = server.gameManager.getEntity(client.entityId);

  if (!entity) return;

  vec2.copy(entity.lastPosition, entity.position);
  vec2.copy(entity.direction, packet.direction);

  const snapshot = processSnapshot(
    {
      position: [entity.position[0], entity.position[1]],
      velocity: processInput(entity.direction)
    },
    Math.min(packet.delta, 1 / TPS)
  );

  entity.position = snapshot.position;
  entity.velocity = snapshot.velocity;

  if (entity instanceof PlayerEntity) {
    entity.lastInputSequenceNumber = packet.tick;
  }
}
