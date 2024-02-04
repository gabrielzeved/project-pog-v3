import { PlayerInfoUpdatePacket } from '@ppog/shared';
import { server } from '../..';
import { PlayerDisconnectEvent } from '../../events/player';
import { Logger } from '../../utils/Logger';

export function PlayerDisconnectEventListener(evt: PlayerDisconnectEvent) {
  Logger.info(`${evt.id} has disconnected (reason: ${evt.reason})`);
  server.removeClient(evt.id);

  // Send connected players to everyone
  server.sendPacketToAllBut(
    new PlayerInfoUpdatePacket({ clients: server.getAllClients() }),
    evt.id
  );
}
