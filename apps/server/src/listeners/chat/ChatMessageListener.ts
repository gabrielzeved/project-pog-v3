import { PlayerChatEvent } from '@ppog/shared';

export function PlayerChatEventListener(evt: PlayerChatEvent) {
  console.log(`${evt.sender.id} : ${evt.message}`);
}
