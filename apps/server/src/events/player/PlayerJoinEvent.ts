import { Event, EventType } from '../Event';

export class PlayerJoinEvent extends Event {
  protected type: EventType = EventType.PLAYER_JOIN;

  constructor(public id: string) {
    super();
  }
}
