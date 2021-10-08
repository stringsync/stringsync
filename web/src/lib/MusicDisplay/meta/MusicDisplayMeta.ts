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
      keyInfos.flatMap((keyInfo) => [...keyInfo.minorKey.harmonic.chordScales, ...keyInfo.minorKey.melodic.chordScales])
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
  public readonly naturalScales: string[];
  public readonly minorScales: string[];

  private constructor(meta: Meta) {
    this.cursorSnapshots = meta.cursorSnapshots;
    this.mainScales = meta.mainScales;
    this.pentatonicScales = meta.pentatonicScales;
    this.naturalScales = meta.majorScales;
    this.minorScales = meta.minorScales;
  }
}
