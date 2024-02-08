import { Event, EventType } from '../Event';

export class PlayerChatEvent extends Event {
  protected type: EventType = EventType.PLAYER_CHAT;

  constructor(
    public senderEntityId: string,
    public message: string
  ) {
    super();
  }
}
