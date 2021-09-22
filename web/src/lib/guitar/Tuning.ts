import { isInteger } from 'lodash';
import { NumberRange } from '../../util/NumberRange';
import { Pitch } from '../music';

export class Tuning {
  static standard() {
    const pitches = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'].map(Pitch.fromString);
    return new Tuning(pitches);
  }

  readonly pitches: Pitch[];

  constructor(pitches: Pitch[]) {
    this.pitches = pitches;
  }

  toFullyQualifiedStrings(): string[] {
    return this.pitches.map((pitch) => pitch.toFullyQualifiedString());
  }

  getPitchAt(string: number) {
    if (!isInteger(string)) {
      throw new Error(`string must be an integer, got: ${string}`);
    }

    const stringRange = this.getStringRange();
    if (!stringRange.contains(string)) {
      throw new Error(`string ${string} is not in: ${stringRange.toString()}`);
    }

    const pitch = [...this.pitches].reverse()[string - 1];
    if (!pitch) {
      throw new Error(`could not find pitch at string ${string}: ${this.toFullyQualifiedStrings()}`);
    }

    return pitch;
  }

  // strings are indexed at 1
  getStringRange() {
    return NumberRange.from(1).to(this.pitches.length);
  }
}
