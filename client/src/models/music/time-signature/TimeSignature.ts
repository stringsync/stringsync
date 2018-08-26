import { Struct, AbstractVexWrapper } from 'models/vextab';

export class TimeSignature extends AbstractVexWrapper {
  public readonly type = 'TIME_SIGNATURE';

  public upper: number;
  public lower: number;

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

  public clone(): TimeSignature {
    return new TimeSignature(this.upper, this.lower);
  }
}
