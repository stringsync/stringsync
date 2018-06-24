import { VextabStruct, AbstractVexWrapper } from 'models/vextab';

export class TimeSignature extends AbstractVexWrapper {
  public readonly upper: number;
  public readonly lower: number;
  public readonly type = 'TIME_SIGNATURE';

  constructor(upper: number, lower: number, struct: VextabStruct | null = null) {
    super(struct);

    this.upper = upper;
    this.lower = lower;
  }

  public toString(): string {
    return `${this.upper}/${this.lower}`;
  }

  public hydrate(): void {
    this.vexAttrs = null;
  }
}
