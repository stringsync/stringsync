import { PitchAccidental, PitchName } from './types';

export const accidentalAsString = (accidental: PitchAccidental) => {
  switch (accidental) {
    case PitchAccidental.Natural:
      return '';
    case PitchAccidental.Sharp:
      return '#';
    case PitchAccidental.Flat:
      return 'b';
    case PitchAccidental.DoubleSharp:
      return '##';
    case PitchAccidental.DoubleFlat:
      return 'bb';
    default:
      throw new Error(`unknown accidental: ${accidental}`);
  }
};

export const accidentalFromString = (str: string) => {
  switch (str) {
    case '':
      return PitchAccidental.Natural;
    case '#':
      return PitchAccidental.Sharp;
    case 'b':
      return PitchAccidental.Flat;
    case '##':
      return PitchAccidental.DoubleSharp;
    case 'bb':
      return PitchAccidental.DoubleFlat;
    default:
      throw new Error(`unknown accidental string: ${str}`);
  }
};

export const nameAsString = (name: PitchName) => {
  switch (name) {
    case PitchName.A:
      return 'A';
    case PitchName.B:
      return 'B';
    case PitchName.C:
      return 'C';
    case PitchName.D:
      return 'D';
    case PitchName.E:
      return 'E';
    case PitchName.F:
      return 'F';
    case PitchName.G:
      return 'G';
    default:
      throw new Error(`unknown note name: ${name}`);
  }
};

export const nameFromString = (str: string) => {
  switch (str) {
    case 'A':
      return PitchName.A;
    case 'B':
      return PitchName.B;
    case 'C':
      return PitchName.C;
    case 'D':
      return PitchName.D;
    case 'E':
      return PitchName.E;
    case 'F':
      return PitchName.F;
    case 'G':
      return PitchName.G;
    default:
      throw new Error(`unknown note name string: ${str}`);
  }
};
