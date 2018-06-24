import { Rhythm } from 'models';

export class Rest {
  public readonly position: number;
  public readonly rhythm: Rhythm;
  public readonly type = 'REST';

  constructor(position: number, rhythm: Rhythm) {
    this.position = position;
    this.rhythm = rhythm;
  }
}
