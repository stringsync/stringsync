import { Cursor } from 'opensheetmusicdisplay';
import { CursorWrapper, CursorWrapperType } from './CursorWrapper';

export class LerpCursorWrapper implements CursorWrapper {
  readonly type = CursorWrapperType.True;

  readonly lagger: Cursor;
  readonly leader: Cursor;
  readonly lerped: Cursor;

  constructor(lagger: Cursor, leader: Cursor, lerped: Cursor) {
    this.lagger = lagger;
    this.leader = leader;
    this.lerped = lerped;
  }

  init() {
    this.lagger.cursorElement.style.zIndex = '2';
    this.leader.cursorElement.style.zIndex = '2';
    this.lerped.cursorElement.style.zIndex = '2';

    this.lagger.resetIterator();
    this.leader.resetIterator();
    this.lerped.resetIterator();
    this.leader.next();

    // TODO(jared) Remove when done developing, only the lerped should show.
    this.lagger.show();
    this.leader.show();
    this.lerped.show();
  }

  update(timeMs: number) {
    this.lerped.cursorElement.style.left = `${Number(this.lerped.cursorElement.style.left.replace('px', '')) + 1}px`;
  }

  clear() {
    this.lagger.hide();
    this.leader.hide();
    this.lerped.hide();
  }
}