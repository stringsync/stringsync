import { Cursor } from 'opensheetmusicdisplay';
import { CursorWrapper, CursorWrapperType } from './types';

export class TrueCursor implements CursorWrapper {
  readonly type = CursorWrapperType.True;

  readonly lagger: Cursor;
  readonly leader: Cursor;

  constructor(lagger: Cursor, leader: Cursor) {
    this.lagger = lagger;
    this.leader = leader;
  }

  update(timeMs: number) {}
}
