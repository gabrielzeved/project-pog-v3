import { PlayerInfoPacket, PlayerInfoUpdatePacket } from '@ppog/shared';
import { server } from '../..';
import { PlayerJoinEvent } from '../../events/player';
import { Logger } from '../../utils/Logger';

export function PlayerJoinEventListener(evt: PlayerJoinEvent) {
  Logger.info(`${evt.id} has joined`);

  // TODO: spawn entity

  const client = server.getClient(evt.id);
  if (!client) return;

  // send player info to the player
  client.sendPacket(
    new PlayerInfoPacket({
      entityId: evt.id
    })
  );

  // TODO: send spawned entities to the player

  // send connected players
  // client.sendPacket(new PlayerInfoUpdatePacket({ clients: server.getAllClients() }));
  server.sendPacketToAll(new PlayerInfoUpdatePacket({ clients: server.getAllClients() }));
}
