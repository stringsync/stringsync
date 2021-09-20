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
}
