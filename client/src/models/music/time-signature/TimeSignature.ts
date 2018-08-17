import { VextabStruct, AbstractVexWrapper } from 'models/vextab';

export class TimeSignature extends AbstractVexWrapper {
  public readonly upper: number;
  public readonly lower: number;
  public readonly type = 'TIME_SIGNATURE';

  constructor(upper: number, lower: number) {
    super();

    this.upper = upper;
    this.lower = lower;
  }

  public get struct(): Vextab.Parsed.ITimeSignature {
    return {
      key: 'time',
      value: this.toString()
    }
  }

  public toString(): string {
    return `${this.upper}/${this.lower}`;
  }

  public hydrate(): void {
    this.vexAttrs = null;
  }
}
