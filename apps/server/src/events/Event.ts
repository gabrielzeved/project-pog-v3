export enum EventType {
  PLAYER_CHAT
}

export abstract class Event {
  protected abstract type: EventType;

  get name(): string {
    return EventType[this.type];
  }
}

export abstract class CancellableEvent extends Event {
  protected abstract type: EventType;
  protected cancelled: boolean = false;

  get isCancelled(): boolean {
    return this.cancelled;
  }
}
