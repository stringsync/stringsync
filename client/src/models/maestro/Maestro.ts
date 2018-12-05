import { Score } from '../score';
import { IPlayer } from '../../@types/youtube';
import { Note } from '../score/line/measure/note';
import { flatMap } from 'lodash';

interface ISpecEdge {
  tick: number;
  note: Note;
}

export interface ISpec {
  start: ISpecEdge;
  stop: ISpecEdge;
}

/**
 * This class is concerned with determining the position within a Score instance
 * given a time.
 */
export class Maestro {
  public readonly score: Score;
  public readonly bpm: number;

  public player: IPlayer | null = null;
  public specs: ISpec[] = [];

  constructor(score: Score, bpm: number) {
    this.score = score;
    this.bpm = bpm;
  }

  public hydrate(): void {
    if (!this.score.hydrated) {
      throw new Error('Score must be hydrated before hydrating Maestro');
    }

    const measures = flatMap(this.score.lines, line => line.measures);
    const notes = flatMap(measures, measure => measure.notes);

    let currTick = 0;
    this.specs = notes.map((note, ndx) => {
      const start = { tick: currTick, note: notes[ndx - 1] || null };
      const stop = { tick: start.tick + note.durationTick, note };

      currTick = stop.tick;

      return { start, stop };
    });
  }
}
