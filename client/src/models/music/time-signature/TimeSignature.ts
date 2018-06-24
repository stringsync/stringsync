import { VextabStruct } from 'models/vextab';

export class TimeSignature {
  public readonly upper: number;
  public readonly lower: number;
  public readonly struct: VextabStruct;
  public readonly type = 'TIME_SIGNATURE';

  constructor(upper: number, lower: number, struct: VextabStruct) {
    this.upper = upper;
    this.lower = lower;
    this.struct = struct;
  }

  public toString(): string {
    return `${this.upper}/${this.lower}`;
  }
}
