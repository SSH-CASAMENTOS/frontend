import { Event } from '@/types';

type EventMap = {
  'event:created': Event;
  'event:updated': Event;
  'event:deleted': Event;
  'wedding:selected': string;
  [key: string]: unknown;
};

type EventHandler<T = unknown> = (data: T) => void;

export class EventEmitter {
  private static instance: EventEmitter;
  private events: Map<string, EventHandler[]>;

  private constructor() {
    this.events = new Map();
  }

  public static getInstance(): EventEmitter {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }

  public on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): () => void {
    if (!this.events.has(event as string)) {
      this.events.set(event as string, []);
    }

    this.events.get(event as string)!.push(handler as EventHandler);

    return () => {
      this.off(event, handler);
    };
  }

  public off<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    if (!this.events.has(event as string)) return;

    const handlers = this.events.get(event as string)!;
    const index = handlers.indexOf(handler as EventHandler);

    if (index !== -1) {
      handlers.splice(index, 1);
    }

    if (handlers.length === 0) {
      this.events.delete(event as string);
    }
  }

  public emit<K extends keyof EventMap>(event: K, data?: EventMap[K]): void {
    if (!this.events.has(event as string)) return;

    this.events.get(event as string)!.forEach((handler) => {
      try {
        handler(data as unknown);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }
}

export const useEventEmitter = (): EventEmitter => {
  return EventEmitter.getInstance();
};
