import { VextabStruct, AbstractVexWrapper } from 'models/vextab';

export class Bar extends AbstractVexWrapper {
  public kind: string;
  public readonly type = 'BAR';

  constructor(kind: string, struct: VextabStruct | null = null) {
    super(struct);

    this.kind = kind;
  }

  public hydrate(staveNote: Vex.Flow.BarNote, tabNote: Vex.Flow.BarNote): void {
    this.vexAttrs = { staveNote, tabNote };
  }
}
