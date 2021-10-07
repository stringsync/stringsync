import { Box } from '../../../util/Box';
import { CursorWrapper } from './types';

const DUMMY_ELEMENT = document.createElement('div');

export class NoopCursor implements CursorWrapper {
  element = DUMMY_ELEMENT;
  timeMs = -1;
  cursorSnapshot = null;
  update(timeMs: number) {
    this.timeMs = timeMs;
  }
  updateStyle() {}
  clear() {}
  show() {}
  disableAutoScroll() {}
  enableAutoScroll() {}
  getBox() {
    return Box.from(-1, -1).to(-1, -1);
  }
  scrollIntoView() {}
}
