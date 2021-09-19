import * as helpers from './helpers';
import { PitchAccidental, PitchName } from './types';

export class Pitch {
  static fromString(str: string): Pitch {
    const [nameStr, accidentalStr, octaveStr] = helpers.parsePitchString(str);

    const name = helpers.nameFromString(nameStr);
    const accidental = helpers.accidentalFromString(accidentalStr);
    const octave = parseInt(octaveStr);

    return new Pitch(name, accidental, octave);
  }

  readonly name: PitchName;
  readonly accidental: PitchAccidental;
  readonly octave: number;

  constructor(name: PitchName, accidental: PitchAccidental, octave: number) {
    this.name = name;
    this.accidental = accidental;
    this.octave = octave;
  }
}
