export type BarKinds = 'SINGLE' | 'DOUBLE';

export class Bar {
  public kind: BarKinds;
  public readonly struct: Vextab.Parsed.IBar;
  public readonly type = 'BAR';

  constructor(kind: BarKinds, struct: Vextab.Parsed.IBar) {
    this.kind = kind;
    this.struct = struct;
  }
}
