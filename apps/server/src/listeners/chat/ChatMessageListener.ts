import { ChatMessagePacket } from '@ppog/shared';

export function ChatMessagePacketListener(packet: ChatMessagePacket) {
  console.log(`${packet.userId} : ${packet.message}`);
}

// export function ChatMessageListener(evt: ChatMessagePacket) {
//   console.log(`${evt.userId} : ${evt.message}`);
// }
