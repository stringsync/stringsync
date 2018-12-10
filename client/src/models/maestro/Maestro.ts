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

export interface IMaestroListener {
  name: string;
  callback: (maestro: Maestro) => any;
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
  public readonly deadTimeMs: number;

  public specs: ISpec[] = [];

  private $currentTimeMs: number = 0;
  private listeners: IMaestroListener[] = [];

  constructor(score: Score, deadTimeMs: number, bpm: number) {
    this.score = score;
    this.bpm = bpm;
    this.deadTimeMs = deadTimeMs;
  }

  // Performs a bsearch for the spec that contains the tick supplied as an argument.
  // This function must be performant as it will be called every animation frame to
  // determine the current spec.
  public get spec(): ISpec | null {
    return bsearch(this.specs, comparator(this.currentTick)) || null;
  }

  public get currentTick(): number {
    return msToTick(this.currentTimeMs, this.bpm);
  }

  public get currentTimeMs(): number {
    return this.$currentTimeMs;
  }

  public set currentTimeMs(currentTimeMs: number) {
    this.$currentTimeMs = currentTimeMs;
    this.broadcast();
  }

  public addListener(listener: IMaestroListener): void {
    if (this.listeners.some(l => l.name === listener.name)) {
      throw new Error(`tried to add duplicate listener: ${listener.name}`);
    }

    this.listeners.push(listener);
  }

  public removeListener(name: string): void {
    this.listeners = this.listeners.filter(listener => listener.name !== name);
  }

  public hasListener(name: string): boolean {
    return this.listeners.some(listener => listener.name === name);
  }

  public hydrate(): void {
    if (!this.score.hydrated) {
      throw new Error('Score must be hydrated before hydrating Maestro');
    }

    const measures = flatMap(this.score.lines, line => line.measures);
    const notes = flatMap(measures, measure => measure.notes);

    let currTick = msToTick(this.deadTimeMs, this.bpm);
    this.specs = notes.map((note, ndx) => {
      const start = { tick: currTick, note: notes[ndx - 1] || null };
      const stop = { tick: start.tick + note.durationTick, note };

      currTick = stop.tick;

      return { start, stop };
    });
  }

  private broadcast(): void {
    this.listeners.forEach(listener => listener.callback(this));
  }
}
