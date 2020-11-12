import { S3 } from 'aws-sdk';
import { Stream } from 'stream';
import { FileStorage, S3Config } from './types';

export class S3Storage implements FileStorage {
  static create(config: S3Config): S3Storage {
    const { accessKeyId, secretAccessKey, bucket, domainName } = config;
    const s3 = new S3({ accessKeyId, secretAccessKey });
    return new S3Storage(s3, bucket, domainName);
  }

  s3: S3;
  bucket: string;
  domainName: string;

  constructor(s3: S3, bucket: string, domainName: string) {
    this.s3 = s3;
    this.bucket = bucket;
    this.domainName = domainName;
  }

  async put(filepath: string, readStream: Stream) {
    const res = await this.s3.upload({ Bucket: this.bucket, Key: filepath, Body: readStream }).promise();
    return `https://${this.domainName}/${res.Key}`;
  }
}
