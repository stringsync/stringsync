import { AbstractVexWrapper, VextabStruct } from 'models/vextab';

export class Rhythm extends AbstractVexWrapper {
  public readonly value: number;
  public readonly dot: boolean;
  public readonly tuplet: number | null;
  public readonly type = 'RHYTHM';

  constructor(value: number, dot: boolean, tuplet: number | null, struct: VextabStruct | null = null) {
    super(struct);

    this.value = value;
    this.dot = dot;
    this.tuplet = tuplet;
  }

  public clone(): Rhythm {
    return new Rhythm(this.value, this.dot, this.tuplet);
  }

  public hydrate() {
    this.vexAttrs = null;
  }
}

export default Rhythm;
