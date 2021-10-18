import { Key } from '@tonaljs/tonal';
import { sortBy } from 'lodash';
import { KeyEnum, KeyInstruction, VexFlowMusicSheetCalculator } from 'opensheetmusicdisplay';
import { ConflictError, InternalError } from '../../errors';

export type MajorKey = ReturnType<typeof Key.majorKey>;

export type MinorKey = ReturnType<typeof Key.minorKey>;

export type KeyInfo = {
  mainScale: string;
  majorKey: MajorKey;
  minorKey: MinorKey;
};

export type KeyEnumString = ReturnType<typeof keyEnumToString>;

// https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/blob/69ff4a62f4a2c487cfb91aed46eec5b617b5749e/src/MusicalScore/VoiceData/Instructions/KeyInstruction.ts#L128
export const keyEnumToString = (keyEnum: KeyEnum) => {
  switch (keyEnum) {
    case KeyEnum.major:
      return 'major';
    case KeyEnum.minor:
      return 'minor';
    case KeyEnum.none:
      return 'none';
    case KeyEnum.dorian:
      return 'dorian';
    case KeyEnum.phrygian:
      return 'phrygian';
    case KeyEnum.lydian:
      return 'lydian';
    case KeyEnum.mixolydian:
      return 'mixolydian';
    // tonaljs seems to use minor and major
    // https://github.com/tonaljs/tonal/tree/main/packages/key
    case KeyEnum.aeolian:
      return 'minor';
    case KeyEnum.ionian:
      return 'major';
    case KeyEnum.locrian:
      return 'locrian';
    default:
      throw new ConflictError(`unhandled key enum: ${keyEnum}`);
  }
};

export const getMajorTonicNote = (keyInstruction: KeyInstruction) => {
  if (keyInstruction.Key === 0) {
    return 'C'; // can't pass an empty string to Key.majorTonicFromKeySignature
  }

  let alterations = '';
  if (keyInstruction.Key < 0) {
    alterations = 'b'.repeat(-keyInstruction.Key);
  }
  if (keyInstruction.Key > 0) {
    alterations = '#'.repeat(keyInstruction.Key);
  }

  const tonic = Key.majorTonicFromKeySignature(alterations);
  if (!tonic) {
    throw new InternalError('could not calculate major tonic from key instruction');
  }

  return tonic;
};

export const getKeyInfo = (keyInstruction: KeyInstruction): KeyInfo => {
  const tonic = getMajorTonicNote(keyInstruction);
  const mode = keyEnumToString(keyInstruction.Mode);
  const mainScale = `${tonic} ${mode}`;

  const majorKey = Key.majorKey(tonic);
  const minorKey = Key.minorKey(majorKey.minorRelative);

  return { mainScale, majorKey, minorKey };
};

export const getDistinctElementsSortedByFrequencyDesc = (arr: string[]): string[] => {
  const freqs: Record<string, number> = {};
  for (const el of arr) {
    if (!(el in freqs)) {
      freqs[el] = 0;
    }
    freqs[el]++;
  }

  return sortBy(Object.entries(freqs), ([el, freq]) => -freq).map(([el]) => el);
};

export const isVexFlowMusicSheetCalculator = (value: any): value is VexFlowMusicSheetCalculator => {
  return value instanceof VexFlowMusicSheetCalculator;
};
