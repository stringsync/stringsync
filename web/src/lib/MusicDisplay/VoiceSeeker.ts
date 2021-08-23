import { first, last } from 'lodash';
import { Cursor, MusicSheet } from 'opensheetmusicdisplay';
import { bsearch } from '../../util/bsearch';
import { NumberRange } from '../../util/NumberRange';
import { IteratorSnapshot } from './IteratorSnapshot';
import { SeekCost, SeekResult, SyncSettings, VoicePointer } from './types';

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
  static create(probe: Cursor, musicSheet: MusicSheet, syncSettings: SyncSettings): VoiceSeeker {
    const voiceSeeker = new VoiceSeeker(probe, musicSheet, syncSettings);
    voiceSeeker.init();
    return voiceSeeker;
  }

  static createNullSeekResult(): SeekResult {
    return {
      timeMs: -1,
      cost: SeekCost.Cheap,
      voicePointer: null,
    };
  }

  readonly probe: Cursor;
  readonly musicSheet: MusicSheet;
  readonly syncSettings: SyncSettings;

  private voicePointers = new Array<VoicePointer>();
  private cachedSeekResult = VoiceSeeker.createNullSeekResult();

  private constructor(probe: Cursor, musicSheet: MusicSheet, syncSettings: SyncSettings) {
    this.probe = probe;
    this.musicSheet = musicSheet;
    this.syncSettings = syncSettings;
  }

  private init() {
    if (this.shouldSkipPointerCalculations()) {
      console.warn('skipping pointer calculations');
      return;
    }
    this.calculateVoicePointers();
  }

  seek(timeMs: number): SeekResult {
    const cheapSeekResult = this.cheapSeek(timeMs);
    if (cheapSeekResult) {
      this.cachedSeekResult = cheapSeekResult;
      return cheapSeekResult;
    }

    const expensiveSeekResult = this.expensiveSeek(timeMs);
    this.cachedSeekResult = expensiveSeekResult;
    return expensiveSeekResult;
  }

  /**
   * Seeks  a voice pointer that contains the timeMs using
   * a number of shortcuts.
   *
   * This method runs in constant time and should always be
   * tried before performing a more expensive scan.
   *
   * Returning null means that it could not find a seek result
   * using a shortcut. Returning a seek result with a null
   * voicePointer means that we can definitively say that there
   * is no voicePointer for a given timeMs.
   */
  private cheapSeek(timeMs: number): SeekResult | null {
    if (this.voicePointers.length === 0) {
      return { timeMs, cost: SeekCost.Cheap, voicePointer: null };
    }

    const firstVoicePointer = first(this.voicePointers)!;
    if (timeMs < firstVoicePointer.timeMsRange.start) {
      return { timeMs, cost: SeekCost.Cheap, voicePointer: null };
    }

    if (firstVoicePointer.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: SeekCost.Cheap, voicePointer: firstVoicePointer };
    }

    // The first voice pointer may have a time range of [0, 0], so we always check
    // the second one just in case.
    const secondVoicePointer = firstVoicePointer.next;
    if (secondVoicePointer && secondVoicePointer.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: SeekCost.Cheap, voicePointer: secondVoicePointer };
    }

    const lastVoicePointer = last(this.voicePointers)!;
    if (timeMs > lastVoicePointer.timeMsRange.end) {
      return { timeMs, cost: SeekCost.Cheap, voicePointer: null };
    }

    const voicePointer = this.cachedSeekResult.voicePointer;
    if (!voicePointer) {
      return null;
    }

    if (voicePointer.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: SeekCost.Cheap, voicePointer };
    }

    const nextVoicePointer = voicePointer.next;
    if (nextVoicePointer && nextVoicePointer.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: SeekCost.Cheap, voicePointer: nextVoicePointer };
    }

    const prevVoicePointer = voicePointer.prev;
    if (prevVoicePointer && prevVoicePointer.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: SeekCost.Cheap, voicePointer: prevVoicePointer };
    }

    return null;
  }

  /**
   * Seeks a voice pointer containing the timeMs using the binary search algorithm.
   */
  private expensiveSeek(timeMs: number): SeekResult {
    const voicePointer = bsearch(this.voicePointers, (voicePointer) => {
      const { start, end } = voicePointer.timeMsRange;
      if (start > timeMs) {
        return -1;
      } else if (end < timeMs) {
        return 1;
      } else {
        return 0;
      }
    });

    return { timeMs, cost: SeekCost.Expensive, voicePointer: voicePointer || null };
  }

  /**
   * Scans through all the voice entries using the probe cursor, then creates
   * snapshots of each iteration. Consumers may use the snapshots to move a
   * cursor to a given point.
   */
  private calculateVoicePointers(): void {
    const voicePointers = new Array<VoicePointer>();

    // Initialize accounting variables
    let prevVoicePointer: VoicePointer | null = null;
    let currBeat = 0;
    let currTimeMs = this.syncSettings.deadTimeMs;
    let index = 0;

    this.probe.reset();

    while (!this.probe.iterator.EndReached) {
      const iteratorSnapshot = IteratorSnapshot.create(this.probe.iterator);

      // Get OSMD-specific references
      const entries = this.probe.VoicesUnderCursor();
      const note = entries[0].Notes[0];

      const bpm = this.probe.iterator.CurrentMeasure.TempoInBPM;
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

      this.probe.next();
    }
    this.probe.reset();

    this.voicePointers = voicePointers.map((voicePointer) => Object.freeze(voicePointer));
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

  private convertNumBeatsToMs(bpm: number, numBeats: number) {
    // bpm is how many quarter notes per minute
    const trueBpm = bpm / 4;
    const mins = numBeats / trueBpm;
    const secs = mins * 60;
    const ms = secs * 1000;
    return ms;
  }
}
