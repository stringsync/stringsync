import { VoiceEntry } from 'opensheetmusicdisplay/build/dist/src';
import { CursorWrapper, CursorWrapperType } from './types';

export class NullCursorWrapper implements CursorWrapper {
  readonly type = CursorWrapperType.Null;

  init(voiceEntries: VoiceEntry[]) {}

  update(timeMs: number) {}

  clear() {}
}
