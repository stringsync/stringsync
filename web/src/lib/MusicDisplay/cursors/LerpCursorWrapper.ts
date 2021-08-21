import { Cursor, MusicSheet } from 'opensheetmusicdisplay';
import { CursorWrapper, CursorWrapperType, SyncSettings } from '../types';
import { VoiceSeeker } from './VoiceSeeker';

export class LerpCursorWrapper implements CursorWrapper {
  readonly type = CursorWrapperType.True;

  readonly lagger: Cursor;
  readonly leader: Cursor;
  readonly lerper: Cursor;
  readonly probe: Cursor;

  private voiceSeeker: VoiceSeeker | null = null;
  private lastSeekResult = VoiceSeeker.createNullSeekResult();

  constructor(lagger: Cursor, leader: Cursor, lerper: Cursor, probe: Cursor) {
    this.lagger = lagger;
    this.leader = leader;
    this.lerper = lerper;
    this.probe = probe;
  }

  init(musicSheet: MusicSheet, syncSettings: SyncSettings) {
    this.lagger.cursorElement.style.zIndex = '2';
    this.leader.cursorElement.style.zIndex = '2';
    this.lerper.cursorElement.style.zIndex = '2';

    this.lagger.resetIterator();
    this.leader.resetIterator();
    this.lerper.resetIterator();
    this.leader.next();

    // TODO(jared) Remove when done developing, only the lerped should show.
    this.lagger.show();
    this.leader.show();
    this.lerper.show();

    this.voiceSeeker = VoiceSeeker.create(this.probe, musicSheet, syncSettings);
  }

  update(timeMs: number) {
    if (!this.voiceSeeker) {
      console.warn('cannot update cursors, must call init first');
      return;
    }

    const lastSeekResult = this.lastSeekResult;
    const nextSeekResult = this.voiceSeeker.seek(timeMs);

    // Calculations will use the lastSeekResult locally scoped variable
    this.lastSeekResult = nextSeekResult;

    if (lastSeekResult === nextSeekResult) {
      // TODO(jared) Update the lerped cursor
      return;
    }

    const voicePointer = nextSeekResult.voicePointer;
    if (!voicePointer) {
      this.clear();
      return;
    }

    this.lagger.iterator = voicePointer.cursor.clone();
    this.leader.iterator = voicePointer.cursor.clone();
    this.lerper.iterator = voicePointer.cursor.clone();

    this.lagger.update();
    this.leader.update();
    this.lerper.update();
  }

  clear() {
    this.lagger.reset();
    this.leader.reset();
    this.lerper.reset();

    this.lagger.hide();
    this.leader.hide();
    this.lerper.hide();
  }
}
