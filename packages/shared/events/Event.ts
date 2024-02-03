export enum EventType {
  PLAYER_CHAT
}

export class Event {
  private _type: EventType;

  get type(): EventType {
    return this._type;
  }

  get name(): string {
    return EventType[this._type];
  }

  constructor(type: EventType) {
    this._type = type;
  }
}

export class CancellableEvent extends Event {
  private _cancelled: boolean = false;

  get isCancelled(): boolean {
    return this._cancelled;
  }

  set isCancelled(cancelled: boolean) {
    this._cancelled = cancelled;
  }
}
