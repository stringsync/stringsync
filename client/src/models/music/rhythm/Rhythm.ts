import { AbstractVexWrapper } from 'models/vextab';
import { Tuplet } from '../tuplet';

export class Rhythm extends AbstractVexWrapper {
  public readonly value: string;
  public readonly dot: boolean;
  public readonly type = 'RHYTHM';

  public tuplet: Tuplet | null = null;

  constructor(value: string, dot: boolean) {
    super();

    this.value = value;
    this.dot = dot;
  }

  public get isGrace(): boolean {
    return this.value === 'g';
  }

  public get struct(): Vextab.Parsed.ITime {
    return { dot: this.dot, time: this.value.toString() };
  }

  public clone(): Rhythm {
    const rhythm = new Rhythm(this.value, this.dot);
    rhythm.tuplet = this.tuplet ? new Tuplet(this.tuplet.value) : null;
    return rhythm;
  }

  public hydrate() {
    this.vexAttrs = null;
  }
}

export default Rhythm;
