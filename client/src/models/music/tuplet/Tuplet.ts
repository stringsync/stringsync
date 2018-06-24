import { VextabStruct, AbstractVexWrapper } from 'models/vextab';

export class Tuplet extends AbstractVexWrapper {
  public readonly value: number;
  public readonly type = 'TUPLET';

  constructor(value: number, struct: VextabStruct | null = null) {
    super(struct);

    this.value = value;
  }

  public hydrate(): void {
    this.vexAttrs = null;
  }
}
