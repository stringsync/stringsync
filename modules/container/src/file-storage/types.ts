import { Stream } from 'stream';

export interface FileStorage {
  put(filename: string, readStream: Stream): Promise<string>;
}
