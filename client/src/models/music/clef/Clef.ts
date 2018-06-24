import { AbstractVexWrapper, VextabStruct } from 'models/vextab';

export class Clef extends AbstractVexWrapper {
  public readonly type = 'CLEF';

  constructor(struct: VextabStruct) {
    super(struct);
  }

  public hydrate(): void {
    this.vexAttrs = null;
  }
}
