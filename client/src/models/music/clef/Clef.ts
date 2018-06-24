export class Clef {
  public readonly struct: Vextab.Parsed.IClef;
  public readonly type = 'CLEF';

  constructor(struct: Vextab.Parsed.IClef) {
    this.struct = struct;
  }
}
