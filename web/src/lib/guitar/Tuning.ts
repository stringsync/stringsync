import { Pitch } from '../music';

export class Tuning {
  static standard() {}

  readonly pitches: Pitch[];

  constructor(pitches: Pitch[]) {
    this.pitches = pitches;
  }
}
