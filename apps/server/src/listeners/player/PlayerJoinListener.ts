import { ClientPackets, Player } from '@ppog/shared';
import { server } from '../..';
import { PlayerJoinEvent } from '../../events/player';
import { Logger } from '../../utils/Logger';

export function PlayerJoinEventListener(evt: PlayerJoinEvent) {
  const entity = new Player(
    evt.id,
    {
      x: Math.floor(Math.random() * 350),
      y: Math.floor(Math.random() * 350)
    },
    'assets/player/texture.png'
  );

  const playerEntity = server.gameManager.spawnEntity(entity);

  const client = server.getClient(evt.id);

  if (!client) return;

  // send player info to the player
  client.sendPacket(
    new ClientPackets.PlayerInfoPacket({
      entityId: evt.id
    })
  );

  // send spawned entities to the player
  for (let entity of server.gameManager.getAllEntities()) {
    client.sendPacket(new ClientPackets.EntitySpawnPacket(entity));
  }

  // send player entity to already connected players
  server.sendPacketToAllBut(new ClientPackets.EntitySpawnPacket(playerEntity), evt.id);

  // send connected players list
  server.sendPacketToAll(
    new ClientPackets.PlayerInfoUpdatePacket({ clients: server.getAllClients() })
  );

  Logger.info(`${evt.id} has joined`);
}
