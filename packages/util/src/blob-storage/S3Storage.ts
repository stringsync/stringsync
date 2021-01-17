import { injectable } from '@stringsync/di';
import { S3 } from 'aws-sdk';
import { Stream } from 'stream';
import { BlobStorage } from './types';

@injectable()
export class S3Storage implements BlobStorage {
  s3: S3;

  constructor() {
    this.s3 = new S3();
  }

  async put(filepath: string, bucket: string, readStream: Stream) {
    const res = await this.s3.upload({ Bucket: bucket, Key: filepath, Body: readStream }).promise();
    return res.Key;
  }
}
