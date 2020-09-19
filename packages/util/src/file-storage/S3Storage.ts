import { FileStorage, S3Config } from './types';
import { S3 } from 'aws-sdk';
import { Stream } from 'stream';

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
    return await new Promise<string>((resolve, reject) => {
      this.s3.upload({ Bucket: this.bucket, Key: filepath, Body: readStream }, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(`https://${this.domainName}/${data.Key}`);
      });
    });
  }
}
