import { VextabStruct, AbstractVexWrapper } from 'models/vextab';

export class Bar extends AbstractVexWrapper {
  public kind: Vex.Flow.Barline.type;
  public readonly type = 'BAR';

  constructor(kind: Vex.Flow.Barline.type, struct: VextabStruct | null = null) {
    super(struct);

    this.kind = kind;
  }

  public hydrate(staveNote: Vex.Flow.BarNote, tabNote: Vex.Flow.BarNote): void {
    this.vexAttrs = { staveNote, tabNote };
  }
}
