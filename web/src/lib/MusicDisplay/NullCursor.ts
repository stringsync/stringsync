import { MusicSheet } from 'opensheetmusicdisplay';
import { CursorWrapper, SyncSettings } from './types';

export class NullCursor implements CursorWrapper {
  init(musicSheet: MusicSheet, syncSettings: SyncSettings) {}
  update(timeMs: number) {}
  clear() {}
}
