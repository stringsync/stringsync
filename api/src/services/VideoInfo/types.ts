import { ReadStream } from 'fs';

export interface VideoInfoService {
  getDurationMs(videoStream: ReadStream): Promise<number>;
}
