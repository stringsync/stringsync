import { Duration } from './Duration';
import { Audibility } from './types';

export class Rest {
  readonly audibility = Audibility.Inaudible;
  readonly duration: Duration;

  constructor(duration: Duration) {
    this.duration = duration;
  }
}
