import { CursorWrapper } from './types';

export class NullCursor implements CursorWrapper {
  update(timeMs: number) {}
  clear() {}
  disableAutoScroll() {}
  enableAutoScroll() {}
}
