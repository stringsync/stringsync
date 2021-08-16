import { CursorWrapper, CursorWrapperType } from './CursorWrapper';

export class NullCursorWrapper implements CursorWrapper {
  readonly type = CursorWrapperType.Null;

  init() {}

  update(timeMs: number) {}

  clear() {}
}
