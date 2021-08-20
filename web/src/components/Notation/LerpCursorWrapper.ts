import { Cursor, MusicSheet } from 'opensheetmusicdisplay';
import { CursorWrapper, CursorWrapperType, SyncSettings } from './types';
import { VoiceSeeker } from './VoiceSeeker';

export class LerpCursorWrapper implements CursorWrapper {
  readonly type = CursorWrapperType.True;

  readonly lagger: Cursor;
  readonly leader: Cursor;
  readonly lerped: Cursor;

  private lastVoiceIndex = 0;

  voiceSeeker: VoiceSeeker | null = null;

  constructor(lagger: Cursor, leader: Cursor, lerped: Cursor) {
    this.lagger = lagger;
    this.leader = leader;
    this.lerped = lerped;
  }

  init(musicSheet: MusicSheet, syncSettings: SyncSettings) {
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

    this.voiceSeeker = VoiceSeeker.create(musicSheet, syncSettings);
  }

  update(timeMs: number) {
    if (!this.voiceSeeker) {
      return;
    }

    const seekResult = this.voiceSeeker.seek(timeMs);
    if (!seekResult.voicePointer) {
      return;
    }

    if (seekResult.voicePointer.index > this.lastVoiceIndex) {
      this.lastVoiceIndex = seekResult.voicePointer.index;
      this.lagger.next();
      this.leader.next();
      this.lerped.next();
    }
  }

  clear() {
    this.lagger.hide();
    this.leader.hide();
    this.lerped.hide();
  }
}
