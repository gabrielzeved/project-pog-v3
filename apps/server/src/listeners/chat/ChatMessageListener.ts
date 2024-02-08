import { PlayerChatEvent } from '../../events/chat';

export function PlayerChatEventListener(evt: PlayerChatEvent) {
  console.log(`${evt.senderEntityId} : ${evt.message}`);
}
