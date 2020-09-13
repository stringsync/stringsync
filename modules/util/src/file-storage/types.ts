import { Stream } from 'stream';

type Location = string;

export interface FileStorage {
  put(filepath: string, readStream: Stream): Promise<Location>;
}

export type S3Config = {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  domainName: string;
};
