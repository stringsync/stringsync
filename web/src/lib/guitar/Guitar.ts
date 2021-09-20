import { Position } from './Position';
import { Tuning } from './Tuning';

export class Guitar {
  readonly tuning: Tuning;

  constructor(tuning: Tuning) {
    this.tuning = tuning;
  }

  getPitchAt(position: Position) {}
}
