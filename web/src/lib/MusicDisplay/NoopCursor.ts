import { Box } from '../../util/Box';
import { CursorWrapper, ScrollAlignment } from './types';

const DUMMY_ELEMENT = document.createElement('div');

export class NoopCursor implements CursorWrapper {
  element = DUMMY_ELEMENT;
  update(timeMs: number) {}
  clear() {}
  disableAutoScroll() {}
  enableAutoScroll() {}
  getBox(): Box {
    return Box.from(-1, -1).to(-1, -1);
  }
  updateScrollAlignment(scrollAlignment: ScrollAlignment) {}
}
