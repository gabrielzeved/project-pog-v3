import { Entity } from '../..';
import { Event, EventType } from '../Event';

export class PlayerChatEvent extends Event {
  protected type: EventType = EventType.PLAYER_CHAT;

  constructor(
    public sender: Entity,
    public message: string
  ) {
    super();
  }
}
