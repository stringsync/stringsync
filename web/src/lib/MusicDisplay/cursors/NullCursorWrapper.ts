import { MusicSheet } from 'opensheetmusicdisplay';
import { CursorWrapper, SyncSettings } from '../types';

export class NullCursorWrapper implements CursorWrapper {
  init(musicSheet: MusicSheet, syncSettings: SyncSettings) {}

  update(timeMs: number) {}

  clear() {}
}
