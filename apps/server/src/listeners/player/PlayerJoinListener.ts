import { ClientPackets, EntityType, WorldData } from '@ppog/shared';
import { server } from '../..';
import { PlayerEntity } from '../../entities/PlayerEntity';
import { PlayerJoinEvent } from '../../events/player';
import { Logger } from '../../utils/Logger';
import World from '../../assets/worlds/map.json';

export function PlayerJoinEventListener(evt: PlayerJoinEvent) {
  const names = ['Gayble', 'Nenemz', 'Kaikans', 'Arzok', 'SrSSS', 'leliys'];
  const entity = new PlayerEntity(
    evt.id,
    names[~~(Math.random() * names.length)],
    [~~(Math.random() * 750), ~~(Math.random() * 750)],
    [0, 0],
    [0, 0],
    'assets/player/data.json'
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
  for (let { id, name, position, spritePath } of server.gameManager.getAllEntities()) {
    client.sendPacket(new ClientPackets.EntitySpawnPacket({ id, name, position, spritePath }));
  }

  // send player entity to already connected players
  server.sendPacketToAllBut(
    new ClientPackets.EntitySpawnPacket({
      id: playerEntity.id,
      name: playerEntity.name,
      position: playerEntity.position,
      spritePath: playerEntity.spritePath,
      type: EntityType.PLAYER
    }),
    evt.id
  );

  // send connected players list
  server.sendPacketToAll(
    new ClientPackets.PlayerInfoUpdatePacket({ clients: server.getAllClients() })
  );

  // load world
  const worldMap = World as WorldData;
  client.sendPacket(new ClientPackets.WorldLoadPacket(worldMap));

  Logger.info(`${evt.id} has joinedd`);
}
