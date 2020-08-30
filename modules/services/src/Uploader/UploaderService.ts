import { injectable } from 'inversify';
import { Stream } from 'stream';
import { createWriteStream, unlink } from 'fs';
import { S3 } from 'aws-sdk';

@injectable()
export class UploaderService {
  async upload(filename: string, readStream: Stream) {
    const path = `./${filename}`;

    const s3 = new S3({
      accessKeyId: '',
      secretAccessKey: '',
    });

    return await new Promise<string>((resolve, reject) => {
      s3.upload({ Bucket: 'stringsync-experiment', Key: filename, Body: readStream }, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data.Location);
      });
    });
  }
}
