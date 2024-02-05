import { ClientPackets } from '@ppog/shared';
import { server } from '../..';
import { PlayerDisconnectEvent } from '../../events/player';
import { Logger } from '../../utils/Logger';

export function PlayerDisconnectEventListener(evt: PlayerDisconnectEvent) {
  server.gameManager.destroyEntity(evt.id);
  server.removeClient(evt.id);

  // Send connected players to everyone
  server.sendPacketToAllBut(
    new ClientPackets.PlayerInfoUpdatePacket({ clients: server.getAllClients() }),
    evt.id
  );

  Logger.info(`${evt.id} has disconnected (reason: ${evt.reason})`);
}
