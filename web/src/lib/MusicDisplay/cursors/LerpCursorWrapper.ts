import { has, set } from 'lodash';
import { Cursor, MusicSheet } from 'opensheetmusicdisplay';
import { CursorWrapper, CursorWrapperType, SyncSettings } from '../types';
import { VoicePointer, VoiceSeeker } from './VoiceSeeker';

export class LerpCursorWrapper implements CursorWrapper {
  readonly type = CursorWrapperType.True;

  readonly lagger: Cursor;
  readonly leader: Cursor;
  readonly lerped: Cursor;

  private currVoicePointer: VoicePointer | null = null;

  voiceSeeker: VoiceSeeker | null = null;

  constructor(lagger: Cursor, leader: Cursor, lerped: Cursor) {
    this.lagger = lagger;
    this.leader = leader;
    this.lerped = lerped;
  }

  init(musicSheet: MusicSheet, syncSettings: SyncSettings) {
    if (!this.isCursorHackable(this.lagger)) {
      throw new Error('cannot hack cursors, check OSMD version');
    }

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
    const nextVoicePointer = seekResult.voicePointer;
    this.moveCursorsToVoicePointer(nextVoicePointer);
    this.currVoicePointer = nextVoicePointer;
  }

  clear() {
    this.lagger.hide();
    this.leader.hide();
    this.lerped.hide();
  }

  /**
   * The reason why cursors are hacked is because the OSMD iterator only goes
   * forward. There are cases where we want to jump ahead or behind past the
   * next or previous entry. The purpose of this method is to do a best effort
   * check to see if the cursors are hackable in the way we expect.
   *
   * The only time a cursor normally jumps is when there's a repetition. Hacks
   * are based around this behavior:
   *
   * https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/blob/e0d70bc67d26465078fc224c69615bd0789cdaa3/src/MusicalScore/MusicParts/MusicPartManagerIterator.ts#L393
   */
  private isCursorHackable(cursor: Cursor): boolean {
    let isHackable = true;

    if (!has(cursor.iterator, 'currentMeasureIndex')) {
      console.warn('cursor does not have currentMeasureIndex defined');
      isHackable = false;
    }

    if (!has(cursor.iterator, 'currentMeasure')) {
      console.warn('cursor does not have currentMeasure defined');
      isHackable = false;
    }

    if (!has(cursor.iterator, 'currentVoiceEntryIndex')) {
      console.warn('cursor does not have currentVoiceEntryIndex defined');
      isHackable = false;
    }

    return isHackable;
  }

  private moveCursorsToVoicePointer(nextVoicePointer: VoicePointer | null) {
    const curr = this.currVoicePointer;
    const next = nextVoicePointer;

    // Identity check is ok since the voice pointers are not recreated between seeks.
    if (curr === next) {
      return;
    }

    if (!next) {
      this.clear();
      return;
    }

    const isOneIndexAway = curr && next && next.index - curr.index === 1;
    if (isOneIndexAway) {
      this.lagger.next();
      this.leader.next();
      this.lerped.next();
    }

    // HACK! Perform jump to wherever the cursors are
    const voice = next.value;

    // TODO(jared) The measure index is messed up, fix that
    console.log(voice);

    set(this.lagger.iterator, 'currentMeasureIndex', voice.measureIndex);
    set(this.leader.iterator, 'currentMeasureIndex', voice.measureIndex);
    set(this.lerped.iterator, 'currentMeasureIndex', voice.measureIndex);

    set(this.lagger.iterator, 'currentMeasure', voice.sourceMeasure);
    set(this.leader.iterator, 'currentMeasure', voice.sourceMeasure);
    set(this.lerped.iterator, 'currentMeasure', voice.sourceMeasure);

    set(this.lagger.iterator, 'currentVoiceEntryIndex', voice.voiceEntryIndex);
    set(this.leader.iterator, 'currentVoiceEntryIndex', voice.voiceEntryIndex);
    set(this.lerped.iterator, 'currentVoiceEntryIndex', voice.voiceEntryIndex);

    const forwardJumpOccurred = curr && next.index > curr.index;
    set(this.lagger.iterator, 'forwardJumpOccurred', forwardJumpOccurred);
    set(this.leader.iterator, 'forwardJumpOccurred', forwardJumpOccurred);
    set(this.lerped.iterator, 'forwardJumpOccurred', forwardJumpOccurred);

    const backwardJumpOccurred = curr && next.index < curr.index;
    set(this.lagger.iterator, 'backwardJumpOccurred', backwardJumpOccurred);
    set(this.leader.iterator, 'backwardJumpOccurred', backwardJumpOccurred);
    set(this.lerped.iterator, 'backwardJumpOccurred', backwardJumpOccurred);

    this.lagger.update();
    this.leader.update();
    this.lerped.update();
  }
}
