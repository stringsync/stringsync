import { CursorWrapper } from './types';

const DUMMY_ELEMENT = document.createElement('div');

export class NullCursor implements CursorWrapper {
  element = DUMMY_ELEMENT;
  update(timeMs: number) {}
  clear() {}
  disableAutoScroll() {}
  enableAutoScroll() {}
}
