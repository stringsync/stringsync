import { getDistinctElementsSortedByFrequencyDesc } from '../helpers';
import { CursorSnapshot, MusicDisplayLocator } from '../locator';

export type Meta = {
  cursorSnapshots: CursorSnapshot[];
  mainScales: string[];
  pentatonicScales: string[];
  majorScales: string[];
  minorScales: string[];
};

export class MusicDisplayMeta {
  static create(locator: MusicDisplayLocator) {
    const keyInfos = locator.cursorSnapshots.map((cursorSnapshot) => cursorSnapshot.getKeyInfo());
    const mainScales = getDistinctElementsSortedByFrequencyDesc(keyInfos.map((keyInfo) => keyInfo.mainScale));
    const majorScales = getDistinctElementsSortedByFrequencyDesc(
      keyInfos.flatMap((keyInfo) => keyInfo.majorKey.chordScales)
    );
    const minorScales = getDistinctElementsSortedByFrequencyDesc(
      // TODO(jared) the altered and ultralocrian scales caused issues when calculating what notes belong to them (both)
      // are 7th degrees of the harmonic and melodic minor scales, respectively. Use all the scale suggestions when
      // ready.
      keyInfos.flatMap((keyInfo) => [keyInfo.minorKey.harmonic.chordScales[0], keyInfo.minorKey.melodic.chordScales[0]])
    );
    const pentatonicScales = getDistinctElementsSortedByFrequencyDesc(
      keyInfos.flatMap((keyInfo) => [
        `${keyInfo.majorKey.tonic} major pentatonic`,
        `${keyInfo.minorKey.tonic} minor pentatonic`,
      ])
    );
    return new MusicDisplayMeta({
      cursorSnapshots: locator.cursorSnapshots,
      mainScales,
      pentatonicScales,
      majorScales,
      minorScales,
    });
  }

  static createNull() {
    return new MusicDisplayMeta({
      cursorSnapshots: [],
      mainScales: [],
      pentatonicScales: [],
      majorScales: [],
      minorScales: [],
    });
  }

  public readonly cursorSnapshots: CursorSnapshot[];
  public readonly mainScales: string[];
  public readonly pentatonicScales: string[];
  public readonly majorScales: string[];
  public readonly minorScales: string[];

  private constructor(meta: Meta) {
    this.cursorSnapshots = meta.cursorSnapshots;
    this.mainScales = meta.mainScales;
    this.pentatonicScales = meta.pentatonicScales;
    this.majorScales = meta.majorScales;
    this.minorScales = meta.minorScales;
  }
}
