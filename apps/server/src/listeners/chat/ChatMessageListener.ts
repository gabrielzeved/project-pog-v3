import { ChatMessagePacket } from '@ppog/shared';

export function ChatMessageListener(evt: ChatMessagePacket) {
  console.log(`${evt.userId} : ${evt.message}`);
}
