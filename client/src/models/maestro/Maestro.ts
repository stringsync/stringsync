import { Score } from '../score';
import { Note } from '../score/line/measure/note';
import { flatMap } from 'lodash';
import { bsearch } from '../../utils/bsearch';
import { msToTick } from '../../utils/conversions';

export interface ISpec {
  startTick: number;
  stopTick: number;
  note: Note | null;
}

export interface IMaestroListener {
  name: string;
  callback: (maestro: Maestro) => any;
}

// Used in bsearch
const comparator = (tick: number) => (spec: ISpec): -1 | 0 | 1 => {
  if (spec.startTick > tick) {
    return -1;
  } else if (spec.stopTick < tick) {
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
  private $currentSpec: ISpec | null = null;
  private listeners: IMaestroListener[] = [];

  constructor(score: Score, deadTimeMs: number, bpm: number) {
    this.score = score;
    this.bpm = bpm;
    this.deadTimeMs = deadTimeMs;
  }

  // Performs a bsearch for the spec that contains the tick supplied as an argument.
  // This function must be performant as it will be called every animation frame to
  // determine the current spec.
  public get currentSpec(): ISpec | null {
    const { currentTick } = this;

    const shouldComputeSpec = (
      !this.$currentSpec ||
      this.$currentSpec.startTick > currentTick ||
      this.$currentSpec.stopTick <= currentTick
    );

    return shouldComputeSpec
      ? bsearch(this.specs, comparator(this.currentTick)) || null
      : this.$currentSpec;
  }

  public get currentTick(): number {
    return msToTick(this.currentTimeMs, this.bpm);
  }

  public get currentTimeMs(): number {
    return this.$currentTimeMs;
  }

  public set currentTimeMs(currentTimeMs: number) {
    const shouldBroadcast = this.$currentTimeMs !== currentTimeMs;

    this.$currentTimeMs = currentTimeMs;

    if (shouldBroadcast) {
      this.broadcast();
    }
  }

  public addListener(listener: IMaestroListener): void {
    if (this.hasListener(listener.name)) {
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
    this.specs = notes.map(note => {
      const startTick = currTick;
      const stopTick = startTick + note.durationTick;
      currTick = stopTick;
      return { startTick, stopTick, note };
    });
  }

  private broadcast(): void {
    this.listeners.forEach(listener => listener.callback(this));
  }
}
