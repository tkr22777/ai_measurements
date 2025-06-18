type EventCallback = () => void;

interface EventMap {
  'gallery:refresh': EventCallback;
  'image:uploaded': EventCallback;
}

class EventBus {
  private events: Map<keyof EventMap, EventCallback[]> = new Map();

  on<K extends keyof EventMap>(event: K, callback: EventMap[K]) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)?.push(callback);
  }

  off<K extends keyof EventMap>(event: K, callback: EventMap[K]) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit<K extends keyof EventMap>(event: K) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback());
    }
  }

  clear() {
    this.events.clear();
  }
}

export const eventBus = new EventBus();
