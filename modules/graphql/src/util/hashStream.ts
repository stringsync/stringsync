import { createHash } from 'crypto';
import { Stream } from 'stream';

export const hashStream = async (stream: Stream): Promise<string> => {
  const hash = createHash('sha256');
  return await new Promise((resolve, reject) => {
    stream
      .on('data', (data) => hash.update(data))
      .on('error', reject)
      .on('end', () => resolve(hash.digest('hex')));
  });
};
