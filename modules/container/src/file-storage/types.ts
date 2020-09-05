import { Stream } from 'stream';

export interface FileStorage {
  put(filepath: string, readStream: Stream): Promise<string>;
}
