import { getDistinctElementsSortedByFrequencyDesc } from '../helpers';
import { CursorSnapshot, MusicDisplayLocator } from '../locator';

export type Meta = {
  cursorSnapshots: CursorSnapshot[];
  mainScales: string[];
  naturalScales: string[];
  minorScales: string[];
};

export class MusicDisplayMeta {
  static create(locator: MusicDisplayLocator) {
    const keyInfos = locator.cursorSnapshots.map((cursorSnapshot) => cursorSnapshot.getKeyInfo());
    const mainScales = getDistinctElementsSortedByFrequencyDesc(keyInfos.map((keyInfo) => keyInfo.mainScale));
    const naturalScales = getDistinctElementsSortedByFrequencyDesc(
      keyInfos.flatMap((keyInfo) => keyInfo.majorKey.chordScales)
    );
    const minorScales = getDistinctElementsSortedByFrequencyDesc(
      keyInfos.flatMap((keyInfo) => [...keyInfo.minorKey.harmonic.chordScales, ...keyInfo.minorKey.melodic.chordScales])
    );
    return new MusicDisplayMeta({ cursorSnapshots: locator.cursorSnapshots, mainScales, naturalScales, minorScales });
  }

  static createNull() {
    return new MusicDisplayMeta({
      cursorSnapshots: [],
      mainScales: [],
      naturalScales: [],
      minorScales: [],
    });
  }

  public readonly cursorSnapshots: CursorSnapshot[];
  public readonly mainScales: string[];
  public readonly naturalScales: string[];
  public readonly minorScales: string[];

  private constructor(meta: Meta) {
    this.cursorSnapshots = meta.cursorSnapshots;
    this.mainScales = meta.mainScales;
    this.naturalScales = meta.naturalScales;
    this.minorScales = meta.minorScales;
  }
}
