import { Cdn } from './types';

export class NoopCdn implements Cdn {
  async getDomainName(cdnId: string) {
    return `https://noopcdn.${cdnId}.net`;
  }
}
