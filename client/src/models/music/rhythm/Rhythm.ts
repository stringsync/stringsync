import { AbstractVexWrapper } from 'models/vextab';
import { Tuplet } from '../tuplet';

export class Rhythm extends AbstractVexWrapper {
  public readonly value: string;
  public readonly dot: boolean;
  public readonly tuplet: Tuplet | null;
  public readonly type = 'RHYTHM';

  constructor(value: string, dot: boolean, tuplet: Tuplet | null) {
    super();

    this.value = value;
    this.dot = dot;
    this.tuplet = tuplet;
  }

  public get isGrace(): boolean {
    return this.value === 'g';
  }

  public get struct(): Vextab.Parsed.ITime {
    return { dot: this.dot, time: this.value.toString() };
  }

  public clone(): Rhythm {
    return new Rhythm(this.value, this.dot, this.tuplet);
  }

  public hydrate() {
    this.vexAttrs = null;
  }
}

export default Rhythm;
