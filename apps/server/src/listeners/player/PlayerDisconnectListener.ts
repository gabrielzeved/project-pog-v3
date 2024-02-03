import { PlayerDisconnectEvent } from '../../events/player';

export function PlayerDisconnectEventListener(evt: PlayerDisconnectEvent) {
  console.log(`${evt.id} has disconnected (reason: ${evt.reason})`);
}