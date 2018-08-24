import { AbstractVexWrapper } from 'models/vextab';
import { id } from 'utilities';

export class Tuplet extends AbstractVexWrapper {
  public readonly id: number;
  public readonly value: number;
  public readonly type = 'TUPLET';

  constructor(value: number) {
    super();

    this.id = id();
    this.value = value;
  }

  public get struct(): Vextab.Parsed.ITuplet {
    return {
      command: 'tuplet',
      params: {
        tuplet: this.value.toString()
      }
    }
  }

  public hydrate(): void {
    this.vexAttrs = null;
  }
}
