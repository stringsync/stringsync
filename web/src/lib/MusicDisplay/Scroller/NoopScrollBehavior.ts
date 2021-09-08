import { ScrollBehavior, ScrollRequest } from './types';

export class NoopScrollBehavior implements ScrollBehavior {
  start() {}
  stop() {}
  call(request: ScrollRequest) {}
}
