type EventCallback<P> = (payload: P) => void;

type Subscriber<P> = { id: symbol; callback: EventCallback<P> };

type SubscriberMap<S> = Partial<{ [E in EventNames<S>]: Array<Subscriber<Payload<S, E>>> }>;

type EventNames<S> = keyof S;

type Payload<S, E extends EventNames<S>> = S[E];

type Subscribers<S, E extends EventNames<S>> = Array<Subscriber<Payload<S, E>>>;
