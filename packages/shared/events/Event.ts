export enum EventType {
  PLAYER_CHAT
}

export abstract class Event {
  protected abstract type: EventType;

  get id(): number {
    return this.type;
  }
}

export abstract class CancellableEvent extends Event {
  protected abstract type: EventType;
  protected cancelled: boolean = false;

  get isCancelled(): boolean {
    return this.cancelled;
  }
}
