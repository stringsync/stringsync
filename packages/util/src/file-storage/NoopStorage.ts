import { FileStorage } from './types';
import { Stream } from 'stream';
import { injectable } from 'inversify';

@injectable()
export class NoopStorage implements FileStorage {
  async put(filename: string, readStream: Stream) {
    return `http://fakestorage.stringsync.com/${filename}`;
  }
}
