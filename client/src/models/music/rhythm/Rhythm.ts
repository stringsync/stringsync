import { AbstractVexWrapper } from 'models/vextab';
import { Tuplet } from '../tuplet';

export class Rhythm extends AbstractVexWrapper {
  public readonly value: number;
  public readonly dot: boolean;
  public readonly grace: boolean;
  public readonly tuplet: Tuplet | null;
  public readonly type = 'RHYTHM';

  constructor(value: number, dot: boolean, grace: boolean, tuplet: Tuplet | null) {
    super();

    this.value = value;
    this.dot = dot;
    this.grace = grace;
    this.tuplet = tuplet;
  }

  public get struct(): Vextab.Parsed.ITime {
    return { dot: this.dot, time: this.value.toString() };
  }

  public clone(): Rhythm {
    return new Rhythm(this.value, this.dot, this.grace, this.tuplet);
  }

  public hydrate() {
    this.vexAttrs = null;
  }
}

export default Rhythm;
