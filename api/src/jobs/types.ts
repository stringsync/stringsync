import { JSONObject } from '../util';

export type Payload = JSONObject;

export type Processor<P extends Payload> = (payload: P) => Promise<void>;

export type JobOpts = {
  intervalMs?: number;
};

export interface Job<P extends Payload> {
  name: string;
  opts: JobOpts;
  process: Processor<P>;
  start(): Promise<void>;
  stop(): Promise<void>;
  enqueue(payload: P, waitForCompletion?: boolean): Promise<void>;
  count(): Promise<number>;
}
