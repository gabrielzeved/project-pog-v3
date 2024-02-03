import { Event } from './Event';

export class EventQueue {
  private _queue: Event[] = [];

  push(event: Event) {
    this._queue.push(event);
  }

  pop(): Event | undefined {
    return this._queue.pop();
  }

  clear() {
    this._queue = [];
  }
}
