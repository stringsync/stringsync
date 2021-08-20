import { difference, first, last, sumBy } from 'lodash';
import { MusicSheet, VoiceEntry } from 'opensheetmusicdisplay';
import { bsearch } from './bsearch';
import * as conversions from './conversions';
import { NumberRange } from './NumberRange';
import { SyncSettings } from './types';

type Voice = {
  beatRange: NumberRange;
  timeMsRange: NumberRange;
  src: VoiceEntry;
};

/**
 * The purpose of this type is to keep track of a value and its
 * position in an array.
 *
 * Index must be tracked because it is the mechanism by which the
 * cursor iterator is set. We store these in an array, which is
 * what distiguishes this data structure from a classic doubly
 * linked list.
 */
type Pointer<T> = {
  index: number;
  next: Pointer<T> | null;
  prev: Pointer<T> | null;
  value: T;
};

type VoicePointer = Pointer<Voice>;

type SeekResult = Readonly<{
  timeMs: number;
  voicePointer: VoicePointer | null;
}>;

/**
 * This purpose of this class is to precompute an association of
 * of time ranges to voices so that they can be looked up quickly.
 *
 * A music sheet has many measures, and a measure has many voices. The
 * voice is ultimately used to determin where a cursor should be.
 *
 * This class is performance sensitive. VoiceSeeker.seek can be called
 * on each animation frame, so many optimization techniques are used.
 */
export class VoiceSeeker {
  static create(musicSheet: MusicSheet, syncSettings: SyncSettings): VoiceSeeker {
    const voiceSeeker = new VoiceSeeker(musicSheet, syncSettings);
    voiceSeeker.init();
    return voiceSeeker;
  }

  musicSheet: MusicSheet;
  syncSettings: SyncSettings;

  private voicePointers = new Array<VoicePointer>();
  private cachedSeekResult: SeekResult | null = null;

  private constructor(musicSheet: MusicSheet, syncSettings: SyncSettings) {
    this.musicSheet = musicSheet;
    this.syncSettings = syncSettings;
  }

  private init() {
    if (this.shouldSkipPointerCalculations()) {
      console.warn('skipping pointer calculations');
      return;
    }
    this.validate();
    this.calculateVoicePointers();
  }

  seek(timeMs: number): SeekResult {
    const cheapSeekResult = this.cheapSeek(timeMs);
    if (cheapSeekResult) {
      console.log('cheap!');
      this.cachedSeekResult = cheapSeekResult;
      return cheapSeekResult;
    }

    const expensiveSeekResult = this.expensiveSeek(timeMs);
    if (expensiveSeekResult) {
      console.log('expensive!');
      this.cachedSeekResult = expensiveSeekResult;
      return expensiveSeekResult;
    }

    const seekResult: SeekResult = { timeMs, voicePointer: null };
    this.cachedSeekResult = seekResult;
    return seekResult;
  }

  /**
   * Seeks  a voice pointer that contains the timeMs using
   * a number of shortcuts.
   *
   * This method runs in constant time and should always be
   * tried before performing a more expensive scan.
   */
  private cheapSeek(timeMs: number): SeekResult | null {
    if (this.voicePointers.length === 0) {
      return null;
    }

    const firstVoicePointer = first(this.voicePointers)!;
    if (timeMs < firstVoicePointer.value.timeMsRange.start) {
      return null;
    }

    const lastVoicePointer = last(this.voicePointers)!;
    if (timeMs > lastVoicePointer.value.timeMsRange.end) {
      return null;
    }

    const cachedSeekResult = this.cachedSeekResult;
    if (!cachedSeekResult) {
      return null;
    }

    const voicePointer = cachedSeekResult.voicePointer;
    if (!voicePointer) {
      return null;
    }

    if (voicePointer.value.timeMsRange.contains(timeMs)) {
      return { timeMs, voicePointer };
    }

    const nextVoicePointer = voicePointer.next;
    if (nextVoicePointer && nextVoicePointer.value.timeMsRange.contains(timeMs)) {
      return { timeMs, voicePointer: nextVoicePointer };
    }

    const prevVoicePointer = voicePointer.prev;
    if (prevVoicePointer && prevVoicePointer.value.timeMsRange.contains(timeMs)) {
      return { timeMs, voicePointer: prevVoicePointer };
    }

    return null;
  }

  /**
   * Seeks a voice pointer containing the timeMs using the binary search algorithm.
   */
  private expensiveSeek(timeMs: number): SeekResult | null {
    const voicePointer = bsearch(this.voicePointers, (voicePointer) => {
      const { start, end } = voicePointer.value.timeMsRange;
      if (start > timeMs) {
        return -1;
      } else if (end < timeMs) {
        return 1;
      } else {
        return 0;
      }
    });

    return { timeMs, voicePointer: voicePointer || null };
  }

  private calculateVoicePointers(): void {
    // TODO(jared) Handle multiple parts.
    const voiceEntries = this.musicSheet.Parts[0].Voices[0].VoiceEntries;
    const voicePointers = new Array<VoicePointer>(voiceEntries.length);

    let currNumBeats = 0;
    let currTimeMs = this.syncSettings.deadTimeMs;
    for (let ndx = 0; ndx < voiceEntries.length; ndx++) {
      const voiceEntry = voiceEntries[0];
      const note = voiceEntry.Notes[0];
      const sourceMeasure = note.SourceMeasure;

      const bpm = sourceMeasure.TempoInBPM;
      const beatsToMs = conversions.bpm(bpm);
      const numBeats = note.Length.RealValue;
      const timeMs = beatsToMs(numBeats);

      const startNumBeats = currNumBeats;
      const endNumBeats = currNumBeats + numBeats;
      const startTimeMs = currTimeMs;
      const endTimeMs = currTimeMs + timeMs;

      const voicePointer: VoicePointer = {
        index: ndx,
        next: null,
        prev: null,
        value: {
          beatRange: NumberRange.from(startNumBeats).to(endNumBeats),
          timeMsRange: NumberRange.from(startTimeMs).to(endTimeMs),
          src: voiceEntry,
        },
      };
      if (ndx > 0) {
        const prev = voicePointers[ndx - 1];
        prev.next = voicePointer;
        voicePointer.prev = prev;
      }
      voicePointers[ndx] = voicePointer;

      currNumBeats = endNumBeats;
      currTimeMs = endTimeMs;
    }

    this.voicePointers = voicePointers;
  }

  private shouldSkipPointerCalculations(): boolean {
    const parts = this.musicSheet.Parts;
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

    const sourceMeasures = this.musicSheet.SourceMeasures;
    if (sourceMeasures.length === 0) {
      console.warn('music sheet has no source measures');
      return true;
    }

    return false;
  }

  private validate() {
    const voiceEntries = this.musicSheet.Parts[0].Voices[0].VoiceEntries;
    const numVoiceEntriesWithoutNotes = sumBy(voiceEntries, (voiceEntry) => (voiceEntry.Notes.length === 0 ? 1 : 0));
    if (numVoiceEntriesWithoutNotes > 0) {
      throw new Error(`found ${numVoiceEntriesWithoutNotes} voice entries without notes`);
    }

    const sourceMeasuresFromMusicSheet = this.musicSheet.SourceMeasures;
    const sourceMeasuresFromVoiceEntries = voiceEntries.map((voiceEntry) => voiceEntry.Notes[0].SourceMeasure);

    const extraSourceMeasuresFromVoiceEntries = difference(
      sourceMeasuresFromVoiceEntries,
      sourceMeasuresFromMusicSheet
    );
    if (extraSourceMeasuresFromVoiceEntries.length > 0) {
      throw new Error(`voice entries have ${extraSourceMeasuresFromVoiceEntries.length} extra source measures`);
    }

    const extraSourceMeasuresFromMusicSheet = difference(sourceMeasuresFromMusicSheet, sourceMeasuresFromVoiceEntries);
    if (extraSourceMeasuresFromMusicSheet.length > 0) {
      throw new Error(`music sheet has ${extraSourceMeasuresFromMusicSheet.length} extra source measures`);
    }
  }
}
