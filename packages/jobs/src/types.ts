export enum Names {
  UPDATE_VIDEO_URL = 'UPDATE_VIDEO_URL',
}

export interface Queue<T> {
  enqueue(data: T): void;
}

export interface Worker<T> {
  start(): void;
  stop(): Promise<void>;
  process(data: T): Promise<void>;
}

export type UpdateVideoUrlData = {};
