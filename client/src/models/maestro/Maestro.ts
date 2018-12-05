import { Score } from '../score';
import { IPlayer } from '../../@types/youtube';
import { Note } from '../score/line/measure/note';
import { flatMap } from 'lodash';

export interface ITickSpec {
  startTick: number;
  stopTick: number;
  startNote: Note | null;
  stopNote: Note | null;
}

/**
 * This class is concerned with determining the position within a Score instance
 * given a time.
 */
export class Maestro {
  public readonly score: Score;
  public readonly bpm: number;
  public readonly player: IPlayer;

  public tickSpecs: ITickSpec[] = [];

  constructor(score: Score, bpm: number, player: IPlayer) {
    this.score = score;
    this.bpm = bpm;
    this.player = player;
  }

  public hydrate(): void {
    if (!this.score.hydrated) {
      throw new Error('Score must be hydrated before hydrating Maestro');
    }

    const measures = flatMap(this.score.lines, line => line.measures);
    const notes = flatMap(measures, measure => measure.notes);

    let currTick = 0;
    this.tickSpecs = notes.map((note, ndx) => {
      const startTick = currTick;
      const stopTick = startTick + note.durationTick;
      const startNote = notes[ndx - 1] || null;
      const stopNote = note;

      currTick = stopTick;

      return { startTick, stopTick, startNote, stopNote };
    });
  }
}
