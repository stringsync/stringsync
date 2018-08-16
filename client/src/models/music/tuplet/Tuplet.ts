import { VextabStruct, AbstractVexWrapper } from 'models/vextab';

export class Tuplet extends AbstractVexWrapper {
  public readonly value: number;
  public readonly type = 'TUPLET';

  constructor(value: number) {
    super();

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
