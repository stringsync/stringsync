type PayloadByEventName = Record<string, any>;

type EventCallback<P> = (payload: P) => void;

type Subscriber<P> = { id: symbol; callback: EventCallback<P> };

type Subscribers<T extends PayloadByEventName, E extends EventNames<T>> = Array<Subscriber<Payload<T, E>>>;

type SubscribersByEventName<T extends PayloadByEventName> = Partial<{ [E in EventNames<T>]: Subscribers<T, E> }>;

type EventNames<T extends PayloadByEventName> = keyof T;

type Payload<T extends PayloadByEventName, E extends EventNames<T>> = T[E];

type EventNameById<T extends PayloadByEventName> = { [key: symbol]: EventNames<T> };

export class EventBus<T extends PayloadByEventName = {}> {
  private subscribersByEvent: SubscribersByEventName<T> = {};
  private eventNameById: EventNameById<T> = {};

  dispatch<E extends EventNames<T>>(eventName: E, payload: Payload<T, E>) {
    if (!this.hasSubscribers(eventName)) {
      return;
    }
    const subscribers = this.fetchSubscribers(eventName);
    for (const subscriber of subscribers) {
      subscriber.callback(payload);
    }
  }

  once<E extends EventNames<T>>(eventName: E, callback: EventCallback<Payload<T, E>>): symbol {
    const id = Symbol();
    this.addSubscriber(eventName, {
      id,
      callback: (payload) => {
        callback(payload);
        this.unsubscribe(id);
      },
    });
    return id;
  }

  subscribe<E extends EventNames<T>>(eventName: E, callback: EventCallback<Payload<T, E>>): symbol {
    const id = Symbol();
    this.addSubscriber(eventName, { id, callback });
    return id;
  }

  unsubscribe(...ids: symbol[]) {
    for (const id of ids) {
      const eventName = this.eventNameById[id];
      delete this.eventNameById[id];
      if (!this.hasSubscribers(eventName)) {
        return;
      }
      this.removeSubscriber(eventName, id);
    }
  }

  private hasSubscribers(eventName: EventNames<T>): boolean {
    return eventName in this.subscribersByEvent;
  }

  private addSubscriber<E extends EventNames<T>>(eventName: E, subscriber: Subscriber<Payload<T, E>>) {
    this.fetchSubscribers(eventName).push(subscriber);
    this.eventNameById[subscriber.id] = eventName;
  }

  private removeSubscriber<E extends EventNames<T>>(eventName: E, id: symbol) {
    const subscribers = this.fetchSubscribers(eventName);
    const nextSubscribers = subscribers.filter((subscriber) => subscriber.id !== id);

    if (nextSubscribers.length === 0) {
      delete this.subscribersByEvent[eventName];
    } else {
      this.subscribersByEvent[eventName] = nextSubscribers;
    }
  }

  private fetchSubscribers<E extends EventNames<T>>(eventName: E): Subscribers<T, E> {
    if (!this.hasSubscribers(eventName)) {
      this.subscribersByEvent[eventName] = [];
    }
    return this.subscribersByEvent[eventName]!;
  }
}
