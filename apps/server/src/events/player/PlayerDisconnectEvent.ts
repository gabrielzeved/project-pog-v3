import { Event, EventType } from '../Event';

export class PlayerDisconnectEvent extends Event {
  protected type: EventType = EventType.PLAYER_DISCONNECT;

  constructor(
    public id: string,
    public reason: string
  ) {
    super();
  }
}
