import { Duration } from './Duration';
import { Pitch } from './Pitch';
import { Audibility } from './types';

export class Note {
  readonly pitch: Pitch;
  readonly duration: Duration;
  readonly audibility = Audibility.Audible;

  constructor(pitch: Pitch, duration: Duration) {
    this.pitch = pitch;
    this.duration = duration;
  }
}
