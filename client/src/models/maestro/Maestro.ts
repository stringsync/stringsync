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

  public specs: ISpec[] = [];

  constructor(score: Score) {
    this.score = score;
  }

  // Performs a bsearch for the spec that contains the tick supplied as an argument.
  // This function must be performant as it will be called every animation frame to
  // determine the current spec.
  public spec(tick: number): ISpec | null {
    return bsearch(this.specs, comparator(tick)) || null;
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
