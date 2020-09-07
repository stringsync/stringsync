import { Stream } from 'stream';

export interface FileStorage {
  put(filepath: string, readStream: Stream): Promise<string>;
}

export type S3Config = {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  domainName: string;
};
