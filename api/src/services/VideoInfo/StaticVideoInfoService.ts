import { injectable } from 'inversify';
import { VideoInfoService } from './types';

@injectable()
export class StaticVideoInfoService implements VideoInfoService {
  async getDurationMs() {
    return 1000;
  }
}
