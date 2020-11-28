import { S3 } from 'aws-sdk';
import { Stream } from 'stream';
import { BlobStorage, S3Config } from './types';

export class S3Storage implements BlobStorage {
  static create(config: S3Config): S3Storage {
    const s3 = new S3();
    return new S3Storage(s3, config.domainName);
  }

  s3: S3;
  domainName: string;

  constructor(s3: S3, domainName: string) {
    this.s3 = s3;
    this.domainName = domainName;
  }

  async put(filepath: string, bucket: string, readStream: Stream) {
    const res = await this.s3.upload({ Bucket: bucket, Key: filepath, Body: readStream }).promise();
    return res.Key;
  }
}
