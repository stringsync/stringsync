export enum JobName {
  UPDATE_VIDEO_URL = 'UPDATE_VIDEO_URL',
}

export type Payload = Record<string, any>;

export type Processor<P extends Payload> = (payload: P) => Promise<void>;

export type JobOpts = {
  intervalMs?: number;
};

export interface Job<P extends Payload> {
  name: JobName;
  opts: JobOpts;
  process: Processor<P>;
  start(): Promise<void>;
  stop(): Promise<void>;
  enqueue(payload: P): Promise<void>;
}
