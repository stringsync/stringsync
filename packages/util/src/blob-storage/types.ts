import { Stream } from 'stream';

type Location = string;

export interface BlobStorage {
  put(filepath: string, bucket: string, readStream: Stream): Promise<Location>;
}

export type S3Config = {
  accessKeyId: string;
  secretAccessKey: string;
  domainName: string;
};
