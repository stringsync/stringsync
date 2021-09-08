import { CursorScrollRequest } from '.';
import { ScrollBehavior } from './types';

export class AutoScrollBehavior implements ScrollBehavior {
  start() {}

  stop() {}

  call(request: CursorScrollRequest) {}
}
