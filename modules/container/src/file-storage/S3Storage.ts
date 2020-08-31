import { FileStorage } from './types';
import { S3 } from 'aws-sdk';
import { Stream } from 'stream';

export class S3Storage implements FileStorage {
  s3: S3;
  bucket: string;
  domainName: string;

  constructor(s3: S3, bucket: string, domainName: string) {
    this.s3 = s3;
    this.bucket = bucket;
    this.domainName = domainName;
  }

  async put(filename: string, readStream: Stream) {
    return await new Promise<string>((resolve, reject) => {
      this.s3.upload({ Bucket: this.bucket, Key: filename, Body: readStream }, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(`https://${this.domainName}/${data.Key}`);
      });
    });
  }
}
