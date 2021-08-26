type EventCallback<P> = (payload: P) => void;

type Subscriber<P> = { id: symbol; callback: EventCallback<P> };

type Subscribers<S, E extends EventNames<S>> = Array<Subscriber<Payload<S, E>>>;

type SubscribersByEvent<S> = Partial<{ [E in EventNames<S>]: Subscribers<S, E> }>;

type EventNames<S> = keyof S;

type Payload<S, E extends EventNames<S>> = S[E];

type EventById<S> = { [key: symbol]: EventNames<S> };

export class EventBus<S = {}> {
  private subscribersByEvent: SubscribersByEvent<S> = {};
  private eventById: EventById<S> = {};

  dispatch<E extends EventNames<S>>(event: E, payload: Payload<S, E>) {
    const subscribers = this.getSubscribers(event);
    for (const subscriber of subscribers) {
      subscriber.callback(payload);
    }
  }

  subscribe<E extends EventNames<S>>(event: E, callback: EventCallback<Payload<S, E>>): symbol {
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

  private isSubscribedEvent(value: any): value is EventNames<S> {
    return value in this.subscribersByEvent;
  }

  private getSubscribers<E extends EventNames<S>>(event: E): Subscribers<S, E> {
    const subscribers = this.subscribersByEvent[event];
    return subscribers ? subscribers : [];
  }
}
