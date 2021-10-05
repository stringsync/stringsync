import execa from 'execa';
import { ReadStream } from 'fs';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify.constants';
import { Logger } from '../../util';
import { VideoInfoService } from './types';

@injectable()
export class FFProbeVideoInfoService implements VideoInfoService {
  constructor(@inject(TYPES.Logger) public logger: Logger) {}

  // Adapted from https://github.com/caffco/get-video-duration/blob/main/src/index.ts
  async getDurationMs(videoStream: ReadStream) {
    const { stdout } = await execa('ffprobe', ['-v', 'error', '-show_format', '-show_streams', '-i', 'pipe:0'], {
      reject: false,
      input: videoStream,
    });

    const durationSecMatches = stdout.match(/duration="?(\d*\.\d*)"?/);

    if (durationSecMatches && durationSecMatches.length > 0) {
      const durationSec = parseFloat(durationSecMatches[1]);
      if (isNaN(durationSec)) {
        this.logger.error(`could not parse video duration`);
        return 0;
      }
      return durationSec * 1000;
    } else {
      this.logger.error(`could not get duration from video`);
      return 0;
    }
  }
}
