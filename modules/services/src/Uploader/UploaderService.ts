import { injectable } from 'inversify';
import { Stream } from 'stream';
import { createWriteStream, unlink } from 'fs';
@injectable()
export class UploaderService {
  async upload(filename: string, readStream: Stream) {
    const path = `./${filename}`;
    await new Promise((resolve, reject) => {
      const writeStream = createWriteStream(path);
      readStream
        .pipe(writeStream)
        .on('finish', () => resolve(true))
        .on('error', () => reject(false));
    });
  }
}
