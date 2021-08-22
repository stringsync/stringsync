import { Cursor, MusicSheet } from 'opensheetmusicdisplay';
import { Callback, CursorWrapper, SyncSettings } from '../types';
import { VoicePointer, VoiceSeeker } from './VoiceSeeker';

export type LerpCursorWrapperOpts = {
  lagger: Cursor;
  leader: Cursor;
  lerper: Cursor;
  probe: Cursor;
  onAutoScrollStart: Callback;
  onAutoScrollEnd: Callback;
};

const END_OF_LINE_LERP_PX = 20;

export class LerpCursorWrapper implements CursorWrapper {
  readonly lagger: Cursor;
  readonly leader: Cursor;
  readonly lerper: Cursor;
  readonly probe: Cursor;
  readonly onAutoScrollStart: Callback;
  readonly onAutoScrollEnd: Callback;

  private isAutoScrollEnabled = true;
  private voiceSeeker: VoiceSeeker | null = null;
  private prevVoicePointer: VoicePointer | null = null;

  constructor(opts: LerpCursorWrapperOpts) {
    this.lagger = opts.lagger;
    this.leader = opts.leader;
    this.lerper = opts.lerper;
    this.probe = opts.probe;
    this.onAutoScrollStart = opts.onAutoScrollStart;
    this.onAutoScrollEnd = opts.onAutoScrollEnd;
  }

  init(musicSheet: MusicSheet, syncSettings: SyncSettings) {
    this.lerper.cursorElement.style.zIndex = '2';

    this.lagger.resetIterator();
    this.leader.resetIterator();
    this.leader.next();
    this.lerper.resetIterator();

    this.lagger.show();
    this.leader.show();
    this.lerper.show();
    this.probe.show();

    this.voiceSeeker = VoiceSeeker.create(this.probe, musicSheet, syncSettings);
  }

  disableAutoScroll() {
    this.isAutoScrollEnabled = false;
  }

  enableAutoScroll() {
    this.isAutoScrollEnabled = true;
    this.onAutoScrollStart();
    this.scrollLaggerIntoView();
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
    } else {
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

    // These are separate because we want the lagger to be scrolled every
    // time its position changes. This mimics the OSMD library behavior.
    if (this.willAutoScroll(prevVoicePointer, voicePointer)) {
      this.onAutoScrollStart();
    }
    if (this.isAutoScrollEnabled) {
      this.scrollLaggerIntoView();
    }
  }

  clear() {
    this.leader.hide();
    this.lagger.hide();
    this.lerper.hide();
  }

  private willAutoScroll(prevVoicePointer: VoicePointer | null, nextVoicePointer: VoicePointer | null): boolean {
    if (!this.isAutoScrollEnabled) {
      return false;
    }
    if (!nextVoicePointer) {
      return false;
    }
    if (!prevVoicePointer && nextVoicePointer) {
      return true;
    }
    if (!prevVoicePointer) {
      return false;
    }

    this.probe.iterator = prevVoicePointer.iteratorSnapshot.get();
    this.probe.update();
    const prevTop = this.probe.cursorElement.style.top;

    this.probe.iterator = nextVoicePointer.iteratorSnapshot.get();
    this.probe.update();
    const nextTop = this.probe.cursorElement.style.top;

    return prevTop !== nextTop;
  }

  private scrollLaggerIntoView() {
    this.lagger.cursorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
