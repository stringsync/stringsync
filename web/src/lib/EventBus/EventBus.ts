type EventCallback<P> = (payload: P) => void;

type Subscriber<P> = { id: symbol; callback: EventCallback<P> };

type Subscribers<S, E extends EventNames<S>> = Array<Subscriber<Payload<S, E>>>;

type SubscribersByEvent<S> = Partial<{ [E in EventNames<S>]: Subscribers<S, E> }>;

type EventNames<S> = keyof S;

type Payload<S, E extends EventNames<S>> = S[E];

type EventNameById<S> = { [key: symbol]: EventNames<S> };

// S is a mapping of events to their respective payload
export class EventBus<S = {}> {
  private subscribersByEvent: SubscribersByEvent<S> = {};
  private eventNameById: EventNameById<S> = {};

  dispatch<E extends EventNames<S>>(eventName: E, payload: Payload<S, E>) {
    if (!this.hasSubscribers(eventName)) {
      return;
    }
    const subscribers = this.fetchSubscribers(eventName);
    for (const subscriber of subscribers) {
      subscriber.callback(payload);
    }
  }

  subscribe<E extends EventNames<S>>(eventName: E, callback: EventCallback<Payload<S, E>>): symbol {
    const id = Symbol();
    this.addSubscriber(eventName, { id, callback });
    return id;
  }

  unsubscribe(id: symbol) {
    const eventName = this.eventNameById[id];
    delete this.eventNameById[id];
    if (!this.hasSubscribers(eventName)) {
      return;
    }
    this.removeSubscriber(eventName, id);
  }

  private hasSubscribers(eventName: EventNames<S>): boolean {
    return eventName in this.subscribersByEvent;
  }

  private addSubscriber<E extends EventNames<S>>(eventName: E, subscriber: Subscriber<Payload<S, E>>) {
    this.fetchSubscribers(eventName).push(subscriber);
    this.eventNameById[subscriber.id] = eventName;
  }

  private removeSubscriber<E extends EventNames<S>>(eventName: E, id: symbol) {
    const subscribers = this.fetchSubscribers(eventName);
    const nextSubscribers = subscribers.filter((subscriber) => subscriber.id !== id);

    if (nextSubscribers.length === 0) {
      delete this.subscribersByEvent[eventName];
    } else {
      this.subscribersByEvent[eventName] = nextSubscribers;
    }
  }

  private fetchSubscribers<E extends EventNames<S>>(eventName: E): Subscribers<S, E> {
    if (!this.hasSubscribers(eventName)) {
      this.subscribersByEvent[eventName] = [];
    }
    return this.subscribersByEvent[eventName]!;
  }
}
