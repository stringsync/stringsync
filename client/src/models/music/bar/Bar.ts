import { VextabStruct, AbstractVexWrapper } from 'models/vextab';

export class Bar extends AbstractVexWrapper {
  public kind: string;
  public readonly type = 'BAR';

  constructor(kind: string, struct: VextabStruct | null = null) {
    super(struct);

    this.kind = kind;
  }

  public hydrate(): void {
    this.vexAttrs = null;
  }
}
