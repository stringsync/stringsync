export type Payload = Record<string, any>;

export type Processor<T extends Payload = Payload> = (payload: T) => Promise<void>;

export type Dispatcher<T extends Payload = Payload> = (payload: T) => void;

export type Job<T extends Payload = Payload> = {
  process: Processor<T>;
  dispatch: Dispatcher<T>;
};
