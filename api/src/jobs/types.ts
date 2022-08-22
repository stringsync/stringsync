import { JSONObject } from '../util';

export type Payload = JSONObject;

export type Processor<P extends Payload> = (payload: P) => Promise<void>;

export type JobOpts = { intervalMs?: number; attempts?: number };

export type Task<P> = { payload: P };

export interface Job<P extends Payload> {
  name: string;
  startWorking(): Promise<void>;
  startDispatching(): Promise<void>;
  stop(): Promise<void>;
  enqueue(payload: P): Promise<void>;
  count(): Promise<number>;
  isHealthy(): Promise<boolean>;
  getTasks(): Promise<Task<P>[]>;
}
