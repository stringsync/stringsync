import * as helpers from './helpers';
import * as spn from './spn';
import { PitchAccidental, PitchName } from './types';

export class Pitch {
  static fromString(str: string): Pitch {
    const { nameChars, accidentalChars, octaveChars } = spn.parse(str);

    const nameStr = nameChars.join('');
    const accidentalStr = accidentalChars.join('');
    const octaveStr = octaveChars.join('');

    if (nameStr === 'X') {
      return Pitch.createNullPitch();
    }

    const name = helpers.nameFromString(nameStr);
    const accidental = helpers.accidentalFromString(accidentalStr);
    const octave = parseInt(octaveStr);

    return new Pitch(name, accidental, octave);
  }

  static createNullPitch() {
    return new Pitch(PitchName.None, PitchAccidental.None, 0);
  }

  readonly name: PitchName;
  readonly accidental: PitchAccidental;
  readonly octave: number;

  constructor(name: PitchName, accidental: PitchAccidental, octave: number) {
    this.name = name;
    this.accidental = accidental;
    this.octave = octave;
  }

  isNullPitch(): boolean {
    return this.name === PitchName.None;
  }

  toString() {
    if (this.isNullPitch()) {
      return 'X';
    }

    const name = helpers.nameAsString(this.name);
    const accidental = helpers.accidentalAsString(this.accidental);
    return this.accidental === PitchAccidental.Natural ? name : `${name}${accidental}`;
  }

  toFullyQualifiedString() {
    if (this.isNullPitch()) {
      return 'X';
    }

    const name = helpers.nameAsString(this.name);
    const accidental = helpers.accidentalAsString(this.accidental);
    const octave = this.octave.toString();
    return `${name}${accidental}${octave}`;
  }
}
