import { Cursor, CursorType } from 'opensheetmusicdisplay';
import { VoicePointer } from '.';
import { NumberRange } from '../../util/NumberRange';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { IteratorSnapshot } from './IteratorSnapshot';
import { VoiceSeeker } from './VoiceSeeker';

export class MusicDisplayProber {
  static probe(imd: InternalMusicDisplay) {
    const musicDisplayProber = new MusicDisplayProber(imd);
    return musicDisplayProber.probe();
  }

  private imd: InternalMusicDisplay;

  private constructor(imd: InternalMusicDisplay) {
    this.imd = imd;
  }

  private probe() {
    const voiceSeeker = this.makeVoiceSeeker();
    return { voiceSeeker };
  }

  private withProbeCursor(callback: (probeCursor: Cursor) => void) {
    const cursorOption = {
      id: Symbol(),
      type: CursorType.Standard,
      color: 'black',
      follow: false,
      alpha: 0,
    };
    const [probeCursor] = this.imd.pushCursors([cursorOption]);
    try {
      callback(probeCursor);
    } finally {
      this.imd.removeCursor(cursorOption.id);
    }
  }

  private forEachCursorPosition(callback: (index: number, probeCursor: Cursor) => void) {
    let index = 0;
    this.withProbeCursor((probeCursor: Cursor) => {
      while (!probeCursor.iterator.EndReached) {
        callback(index, probeCursor);
        probeCursor.next();
        index++;
      }
    });
  }

  /**
   * Scans through all the voice entries using the probe cursor, then creates
   * snapshots of each iteration. Consumers may use the snapshots to move a
   * cursor to a given point.
   */
  private makeVoiceSeeker(): VoiceSeeker {
    if (this.shouldSkipPointerCalculations()) {
      console.warn('skipping pointer calculations');
      return VoiceSeeker.create([]);
    }

    const voicePointers = new Array<VoicePointer>();

    // Initialize accounting variables
    let prevVoicePointer: VoicePointer | null = null;
    let currBeat = 0;
    let currTimeMs = this.imd.syncSettings.deadTimeMs;

    this.forEachCursorPosition((index, probeCursor) => {
      const iteratorSnapshot = IteratorSnapshot.create(probeCursor.iterator);

      // Get OSMD-specific references
      const entries = probeCursor.VoicesUnderCursor();
      const note = entries[0].Notes[0];

      const bpm = probeCursor.iterator.CurrentMeasure.TempoInBPM;
      const numBeats = note.Length.RealValue;

      // Calculate beat range
      const startBeat = currBeat;
      const endBeat = startBeat + numBeats;
      const beatRange = NumberRange.from(startBeat).to(endBeat);

      // Calculate time range
      const startTimeMs = currTimeMs;
      const endTimeMs = startTimeMs + this.convertNumBeatsToMs(bpm, numBeats);
      const timeMsRange = NumberRange.from(startTimeMs).to(endTimeMs);

      // Caluclate voice pointer
      const voicePointer: VoicePointer = {
        index,
        next: null,
        prev: null,
        beatRange,
        timeMsRange,
        iteratorSnapshot,
        entries,
      };
      voicePointers.push(voicePointer);

      // Perform linking if necessary
      if (prevVoicePointer) {
        voicePointer.prev = prevVoicePointer;
        prevVoicePointer.next = voicePointer;
      }

      // Update accounting variables
      prevVoicePointer = voicePointer;
      currBeat = endBeat;
      currTimeMs = endTimeMs;
      index++;
    });

    const frozenVoicePointers = voicePointers.map((voicePointer) => Object.freeze(voicePointer));
    return VoiceSeeker.create(frozenVoicePointers);
  }

  private shouldSkipPointerCalculations(): boolean {
    const parts = this.imd.Sheet.Parts;
    if (parts.length === 0) {
      console.warn('music sheet has no parts');
      return true;
    }

    const voices = parts[0].Voices;
    if (voices.length === 0) {
      console.warn('music sheet has no voices');
      return true;
    }

    const voiceEntries = voices[0].VoiceEntries;
    if (voiceEntries.length === 0) {
      console.warn('music sheet has no voice entries');
      return true;
    }

    const sourceMeasures = this.imd.Sheet.SourceMeasures;
    if (sourceMeasures.length === 0) {
      console.warn('music sheet has no source measures');
      return true;
    }

    return false;
  }

  private convertNumBeatsToMs(bpm: number, numBeats: number) {
    // bpm is how many quarter notes per minute
    const trueBpm = bpm / 4;
    const mins = numBeats / trueBpm;
    const secs = mins * 60;
    const ms = secs * 1000;
    return ms;
  }
}
