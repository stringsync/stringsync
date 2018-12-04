import { Score } from '../score';
import { IPlayer } from '../../@types/youtube';

/**
 * This class is concerned with determining the position within a Score instance
 * given a time.
 */
export class Maestro {
  public readonly score: Score;
  public readonly bpm: number;
  public readonly player: IPlayer;

  constructor(score: Score, bpm: number, player: IPlayer) {
    this.score = score;
    this.bpm = bpm;
    this.player = player;
  }
}
