import { FileStorage } from './types';
import { Stream } from 'stream';

export class FakeStorage implements FileStorage {
  async put(filename: string, readStream: Stream) {
    return `http://example.com/${filename}`;
  }
}
