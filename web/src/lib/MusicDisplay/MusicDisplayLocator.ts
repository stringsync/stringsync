import { first, groupBy, last, sortBy } from 'lodash';
import { bsearch } from '../../util/bsearch';
import { NumberRange } from '../../util/NumberRange';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { LocateCost, LocateResult, VoicePointer } from './types';
import { VoicePointerCalculator } from './VoicePointerCalculator';

type VoicePointerLineGroup = {
  yRange: NumberRange;
  voicePointers: VoicePointer[];
};

export class MusicDisplayLocator {
  static create(imd: InternalMusicDisplay) {
    const voicePointers = VoicePointerCalculator.calcuateVoicePointers(imd);
    const locator = new MusicDisplayLocator(voicePointers);
    locator.init();
    return locator;
  }

  static createNullSeekResult(): LocateResult {
    return { timeMs: -1, cost: LocateCost.Cheap, voicePointer: null };
  }

  readonly voicePointers: VoicePointer[];
  private cachedLocateByTimeMsResult = MusicDisplayLocator.createNullSeekResult();
  private cachedLocateByPositionResult = MusicDisplayLocator.createNullSeekResult();
  private voicePointerLineGroups: VoicePointerLineGroup[];

  private constructor(voicePointers: VoicePointer[], voicePointerLineGroups: VoicePointerLineGroup[] = []) {
    this.voicePointers = voicePointers;
    this.voicePointerLineGroups = voicePointerLineGroups;
  }

  clone() {
    return new MusicDisplayLocator(this.voicePointers, this.voicePointerLineGroups);
  }

  locateByTimeMs(timeMs: number): LocateResult {
    const cheapLocateResult = this.cheapLocateByTimeMs(timeMs);
    if (cheapLocateResult) {
      this.cachedLocateByTimeMsResult = cheapLocateResult;
      return cheapLocateResult;
    }

    const expensiveLocateResult = this.expensiveLocateByTimeMs(timeMs);
    this.cachedLocateByTimeMsResult = expensiveLocateResult;
    return expensiveLocateResult;
  }

  locateByPosition(x: number, y: number): LocateResult {
    const cheapLocateResult = this.cheapSeekByPosition(x, y);
    if (cheapLocateResult) {
      this.cachedLocateByPositionResult = cheapLocateResult;
      return cheapLocateResult;
    }

    const expensiveLocateResult = this.expensiveLocateByPosition(x, y);
    this.cachedLocateByPositionResult = expensiveLocateResult;
    return expensiveLocateResult;
  }

  private init() {
    const toStr = (range: NumberRange) => `${range.start}-${range.end}`;
    const toRange = (str: string) => {
      const [start, end] = str.split('-').map(parseFloat);
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

  private cheapLocateByTimeMs(timeMs: number): LocateResult | null {
    if (this.voicePointers.length === 0) {
      return { timeMs, cost: LocateCost.Cheap, voicePointer: null };
    }

    const firstVoicePointer = first(this.voicePointers)!;
    if (timeMs < firstVoicePointer.timeMsRange.start) {
      return { timeMs, cost: LocateCost.Cheap, voicePointer: null };
    }

    if (firstVoicePointer.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: LocateCost.Cheap, voicePointer: firstVoicePointer };
    }

    // The first voice pointer may have a time range of [0, 0], so we always check
    // the second one just in case.
    const secondVoicePointer = firstVoicePointer.next;
    if (secondVoicePointer && secondVoicePointer.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: LocateCost.Cheap, voicePointer: secondVoicePointer };
    }

    const lastVoicePointer = last(this.voicePointers)!;
    if (timeMs > lastVoicePointer.timeMsRange.end) {
      return { timeMs, cost: LocateCost.Cheap, voicePointer: null };
    }

    const voicePointer = this.cachedLocateByTimeMsResult.voicePointer;
    if (!voicePointer) {
      return null;
    }

    if (voicePointer.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: LocateCost.Cheap, voicePointer };
    }

    const nextVoicePointer = voicePointer.next;
    if (nextVoicePointer && nextVoicePointer.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: LocateCost.Cheap, voicePointer: nextVoicePointer };
    }

    const prevVoicePointer = voicePointer.prev;
    if (prevVoicePointer && prevVoicePointer.timeMsRange.contains(timeMs)) {
      return { timeMs, cost: LocateCost.Cheap, voicePointer: prevVoicePointer };
    }

    return null;
  }

  /**
   * Seeks a voice pointer containing the timeMs using the binary search algorithm.
   */
  private expensiveLocateByTimeMs(timeMs: number): LocateResult {
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

    return { timeMs, cost: LocateCost.Expensive, voicePointer: voicePointer || null };
  }

  private cheapSeekByPosition(x: number, y: number): LocateResult | null {
    if (this.voicePointers.length === 0) {
      return { timeMs: 0, cost: LocateCost.Cheap, voicePointer: null };
    }

    const voicePointer = this.cachedLocateByPositionResult.voicePointer;
    if (!voicePointer) {
      return null;
    }

    if (voicePointer.xRange.contains(x) && voicePointer.yRange.contains(y)) {
      const timeMs = this.lerpTimeMs(x, voicePointer);
      return { timeMs, cost: LocateCost.Cheap, voicePointer };
    }

    const nextVoicePointer = voicePointer.next;
    if (nextVoicePointer && nextVoicePointer.xRange.contains(x) && nextVoicePointer.yRange.contains(y)) {
      const timeMs = this.lerpTimeMs(x, nextVoicePointer);
      return { timeMs, cost: LocateCost.Cheap, voicePointer: nextVoicePointer };
    }

    const prevVoicePointer = voicePointer.prev;
    if (prevVoicePointer && prevVoicePointer.xRange.contains(x) && prevVoicePointer.yRange.contains(y)) {
      const timeMs = this.lerpTimeMs(x, prevVoicePointer);
      return { timeMs, cost: LocateCost.Cheap, voicePointer: prevVoicePointer };
    }

    return null;
  }

  private expensiveLocateByPosition(x: number, y: number): LocateResult {
    const voicePointerLineGroup = bsearch(this.voicePointerLineGroups, (voicePointerLineGroup) => {
      const { start, end } = voicePointerLineGroup.yRange;
      if (start > y) {
        return -1;
      } else if (end < y) {
        return 1;
      } else {
        return 0;
      }
    });

    if (!voicePointerLineGroup) {
      return { timeMs: -1, cost: LocateCost.Expensive, voicePointer: null };
    }

    const voicePointer = bsearch(voicePointerLineGroup.voicePointers, (voicePointer) => {
      const { start, end } = voicePointer.xRange;
      if (start > x) {
        return -1;
      } else if (end < x) {
        return 1;
      } else {
        return 0;
      }
    });

    if (!voicePointer) {
      return { timeMs: -1, cost: LocateCost.Expensive, voicePointer: null };
    }

    const timeMs = this.lerpTimeMs(x, voicePointer);
    return { timeMs, cost: LocateCost.Expensive, voicePointer };
  }

  private lerpTimeMs(x: number, voicePointer: VoicePointer) {
    const t0 = voicePointer.timeMsRange.start;
    const t1 = voicePointer.timeMsRange.end;
    const x0 = voicePointer.xRange.start;
    const x1 = voicePointer.xRange.end;

    const t = t1 + ((x - x1) * (t1 - t0)) / (x1 - x0);

    return t;
  }
}
