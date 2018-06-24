export class TimeSignature {
  public readonly upper: number;
  public readonly lower: number;
  public readonly type = 'TIME_SIGNATURE';

  constructor(upper: number, lower: number) {
    this.upper = upper;
    this.lower = lower;
  }

  public toString(): string {
    return `${this.upper}/${this.lower}`;
  }
}
