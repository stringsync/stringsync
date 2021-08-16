import { CursorWrapper, CursorWrapperType } from './types';

export class NullCursor implements CursorWrapper {
  readonly type = CursorWrapperType.Null;

  update(timeMs: number) {}
}
