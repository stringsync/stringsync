import { ScrollBehavior, ScrollRequest } from './types';

export class NoopScrollBehavior implements ScrollBehavior {
  start() {}
  stop() {}
  handle(request: ScrollRequest) {}
}
