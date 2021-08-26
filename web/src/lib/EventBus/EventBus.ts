type EventCallback<P> = (payload: P) => void;

type Subscriber<P> = { id: symbol; callback: EventCallback<P> };

type SubscriberMap<S> = Partial<{ [E in EventName<S>]: Array<Subscriber<Payload<S, E>>> }>;

type EventName<S> = keyof S;

type Payload<S, E extends EventName<S>> = S[E];

type Subscribers<S, E extends EventName<S>> = Array<Subscriber<Payload<S, E>>>;

export class EventBus<S = {}> {
  private subscribersByEvent: SubscriberMap<S> = {};
  private eventById: { [key: symbol]: EventName<S> } = {};

  dispatch<E extends EventName<S>>(event: E, payload: Payload<S, E>) {
    const subscribers = this.getSubscribers(event);
    for (const subscriber of subscribers) {
      subscriber.callback(payload);
    }
  }

  subscribe<E extends EventName<S>>(event: E, callback: EventCallback<Payload<S, E>>): symbol {
    const id = Symbol(event.toString());
    const subscribers = this.getSubscribers(event);
    const subscriber = { id, callback };
    subscribers.push(subscriber);

    this.subscribersByEvent[event] = subscribers;
    this.eventById[id] = event;

    return id;
  }

  unsubscribe(id: symbol) {
    const event = this.eventById[id];
    delete this.eventById[id];
    if (!this.isSubscribedEvent(event)) {
      return;
    }

    const subscribers = this.getSubscribers(event);
    const nextSubscribers = subscribers.filter((subscriber) => subscriber.id !== id);

    if (nextSubscribers.length === 0) {
      delete this.subscribersByEvent[event];
    } else {
      this.subscribersByEvent[event] = nextSubscribers;
    }
  }

  private isSubscribedEvent(value: any): value is EventName<S> {
    return value in this.subscribersByEvent;
  }

  private getSubscribers<E extends EventName<S>>(event: E): Subscribers<S, E> {
    const subscribers = this.subscribersByEvent[event];
    return subscribers ? subscribers : [];
  }
}
