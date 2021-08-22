import { Cursor, MusicSheet } from 'opensheetmusicdisplay';
import { CursorWrapper, CursorWrapperType, SyncSettings } from '../types';
import { VoicePointer, VoiceSeeker } from './VoiceSeeker';

const END_OF_LINE_LERP_PX = 20;

export class LerpCursorWrapper implements CursorWrapper {
  readonly type = CursorWrapperType.True;

  readonly lagger: Cursor;
  readonly leader: Cursor;
  readonly lerper: Cursor;
  readonly probe: Cursor;

  private voiceSeeker: VoiceSeeker | null = null;
  private prevVoicePointer: VoicePointer | null = null;

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
    this.leader.next();
    this.lerper.resetIterator();

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

    const seekResult = this.voiceSeeker.seek(timeMs);

    const voicePointer = seekResult.voicePointer;
    const prevVoicePointer = this.prevVoicePointer;
    this.prevVoicePointer = voicePointer;

    if (voicePointer === prevVoicePointer) {
      this.updateLerper(timeMs, voicePointer);
      return;
    }

    if (!voicePointer) {
      this.clear();
      return;
    }

    // Since we know this voicePointer is new, we don't need to update
    // the lerper.
    this.lagger.iterator = voicePointer.iteratorSnapshot.get();
    this.leader.iterator = voicePointer.iteratorSnapshot.get();
    this.leader.next();
    this.lerper.iterator = voicePointer.iteratorSnapshot.get();

    this.lagger.update();
    this.leader.update();
    this.lerper.update();

    if (this.lagger.hidden) {
      this.lagger.show();
    }
    if (this.leader.hidden) {
      this.leader.show();
    }
    if (this.lerper.hidden) {
      this.lerper.show();
    }
  }

  clear() {
    this.leader.hide();
    this.lagger.hide();
    this.lerper.hide();
  }

  private updateLerper(timeMs: number, voicePointer: VoicePointer | null) {
    if (!voicePointer) {
      return;
    }
    if (!voicePointer.timeMsRange.contains(timeMs)) {
      return;
    }

    const t1 = voicePointer.timeMsRange.start;
    const t2 = voicePointer.timeMsRange.end;

    const x1 = this.parseFloatIgnoringPx(this.lagger.cursorElement.style.left);
    const x2 = this.isLerpingOnSameLine()
      ? this.parseFloatIgnoringPx(this.leader.cursorElement.style.left)
      : x1 + END_OF_LINE_LERP_PX;

    const m = (x2 - x1) / (t2 - t1);
    const b = x1 - m * t1;
    const t = timeMs;

    // y = mx + b
    const x = m * t + b;

    this.lerper.cursorElement.style.left = `${x}px`;
  }

  private parseFloatIgnoringPx(str: string): number {
    const numeric = str.replace('px', '');
    return parseFloat(numeric);
  }

  private isLerpingOnSameLine(): boolean {
    return this.lagger.cursorElement.style.top === this.leader.cursorElement.style.top;
  }
}
