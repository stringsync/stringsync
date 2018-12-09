import { Score } from '../score';
import { Note } from '../score/line/measure/note';
import { flatMap } from 'lodash';
import { bsearch } from '../../utils/bsearch';
import { msToTick } from '../../utils/conversions';

interface ISpecEdge {
  tick: number;
  note: Note;
}

export interface ISpec {
  start: ISpecEdge;
  stop: ISpecEdge;
}

// Used in bsearch
const comparator = (tick: number) => (spec: ISpec): -1 | 0 | 1 => {
  if (spec.start.tick > tick) {
    return -1;
  } else if (spec.stop.tick < tick) {
    return 1;
  } else {
    return 0;
  }
};

/**
 * This class is concerned with determining the position within a Score instance
 * given a tick.
 */
export class Maestro {
  public readonly score: Score;
  public readonly bpm: number;

  public specs: ISpec[] = [];
  public currentTimeMs: number = 0;

  constructor(score: Score, bpm: number) {
    this.score = score;
    this.bpm = bpm;
  }

  // Performs a bsearch for the spec that contains the tick supplied as an argument.
  // This function must be performant as it will be called every animation frame to
  // determine the current spec.
  public get spec(): ISpec | null {
    return bsearch(this.specs, comparator(msToTick(this.currentTimeMs, this.bpm))) || null;
  }

  public get currentTick(): number {
    return msToTick(this.currentTimeMs, this.bpm);
  }

  public hydrate(deadTimeMs: number, bpm: number): void {
    if (!this.score.hydrated) {
      throw new Error('Score must be hydrated before hydrating Maestro');
    }

    const measures = flatMap(this.score.lines, line => line.measures);
    const notes = flatMap(measures, measure => measure.notes);

    let currTick = msToTick(deadTimeMs, bpm);
    this.specs = notes.map((note, ndx) => {
      const start = { tick: currTick, note: notes[ndx - 1] || null };
      const stop = { tick: start.tick + note.durationTick, note };

      currTick = stop.tick;

      return { start, stop };
    });
  }
}
