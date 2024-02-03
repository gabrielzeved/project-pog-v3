import { Event } from '@ppog/shared';

export type EventClass = new (...args: any[]) => Event;
export type ListenerFunction<T extends Event = any> = (evt: T) => void;
