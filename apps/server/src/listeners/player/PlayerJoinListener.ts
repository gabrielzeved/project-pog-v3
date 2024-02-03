import { PlayerJoinEvent } from '../../events/player';

export function PlayerJoinEventListener(evt: PlayerJoinEvent) {
  console.log(`${evt.id} has joined`);
}
