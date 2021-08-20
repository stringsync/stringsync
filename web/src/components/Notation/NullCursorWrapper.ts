import { MusicSheet } from 'opensheetmusicdisplay';
import { CursorWrapper, CursorWrapperType, SyncSettings } from './types';

export class NullCursorWrapper implements CursorWrapper {
  readonly type = CursorWrapperType.Null;

  init(musicSheet: MusicSheet, syncSettings: SyncSettings) {}

  update(timeMs: number) {}

  clear() {}
}
