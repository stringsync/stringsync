import { injectable } from 'inversify';
import { Stream } from 'stream';
import { BlobStorage } from './types';

@injectable()
export class NoopStorage implements BlobStorage {
  async put(filename: string, bucket: string, readStream: Stream) {
    return `http://fakestorage.stringsync.com/${bucket}/${filename}`;
  }
}
