import { Score } from './Score';

export class Caret {
  public readonly score: Score;

  constructor(score: Score) {
    this.score = score;
  }

  public render(): void {
    // noop
  }

  public clear(): void {
    // noop
  }
}
