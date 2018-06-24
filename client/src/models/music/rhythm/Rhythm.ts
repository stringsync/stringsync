export class Rhythm {
  public readonly value: number;
  public readonly dot: boolean;
  public readonly tuplet: number | null;
  public readonly type = 'RHYTHM';

  constructor(value: number, dot: boolean, tuplet: number | null) {
    this.value = value;
    this.dot = dot;
    this.tuplet = tuplet;
  }

  public clone(): Rhythm {
    return new Rhythm(this.value, this.dot, this.tuplet);
  }
}

export default Rhythm;
