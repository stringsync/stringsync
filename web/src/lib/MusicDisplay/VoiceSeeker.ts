import { first, groupBy, last, sortBy } from 'lodash';
import { bsearch } from '../../util/bsearch';
import { NumberRange } from '../../util/NumberRange';
import { SeekCost, SeekResult, VoicePointer } from './types';

type VoicePointerLineGroup = {
  yRange: NumberRange;
  voicePointers: VoicePointer[];
};

export class VoiceSeeker {
  static create(voicePointers: VoicePointer[]) {
    if (!VoiceSeeker.areVoicePointersValid(voicePointers)) {
      throw new Error('voice pointers are invalid');
    }
    const voiceSeeker = new VoiceSeeker(voicePointers);
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

  private static areVoicePointersValid(voicePointers: VoicePointer[]): boolean {
    if (voicePointers.length === 0) {
      return true;
    }

    const firstVoicePointer = first(voicePointers)!;
    if (firstVoicePointer.prev) {
      console.warn(`starting voice pointer has a previous value`);
      return false;
    }

    let numLinkedVoicePointers = 1;
    let currentVoicePointer: VoicePointer | null = firstVoicePointer.next;
    while (currentVoicePointer) {
      if (numLinkedVoicePointers > voicePointers.length) {
        console.warn('detected too many voice pointers, they may not be linked correctly');
        return false;
      }
      const prevVoicePointer = currentVoicePointer.prev;
      if (!prevVoicePointer) {
        console.warn('voice pointers prev may not be linked correctly');
        return false;
      }

      if (prevVoicePointer.timeMsRange.end > currentVoicePointer.timeMsRange.start) {
        console.warn('detected voice pointer timeMs overlap');
        return false;
      }

      currentVoicePointer = currentVoicePointer.next;
      numLinkedVoicePointers++;
    }
    if (numLinkedVoicePointers !== voicePointers.length) {
      console.warn(`num linked voice pointers does not match voice pointer length`);
      return false;
    }

    return true;
  }

  readonly voicePointers: VoicePointer[];
  private cachedSeekResult = VoiceSeeker.createNullSeekResult();
  private voicePointerLineGroups = new Array<VoicePointerLineGroup>();

  private constructor(voicePointers: VoicePointer[]) {
    this.voicePointers = voicePointers;
  }

  private init() {
    const toStr = (range: NumberRange) => `${range.start}-${range.end}`;
    const toRange = (str: string) => {
      const [start, end] = str.split('-').map(parseInt);
      return NumberRange.from(start).to(end);
    };

    const voicePointersByYRangeStr = groupBy(this.voicePointers, (voicePointer) => toStr(voicePointer.yRange));
    const yRangeStrs = sortBy(
      Object.keys(voicePointersByYRangeStr),
      (str) => toRange(str).start,
      (str) => toRange(str).end
    );

    this.voicePointerLineGroups = yRangeStrs.map((yRangeStr) => {
      return {
        yRange: toRange(yRangeStr),
        voicePointers: voicePointersByYRangeStr[yRangeStr],
      };
    });
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
}
