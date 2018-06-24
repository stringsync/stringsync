export class Annotations {
  public texts: string[];
  public readonly struct: Vextab.Parsed.IAnnotations;
  public readonly type = 'ANNOTATIONS';

  constructor(texts: string[], struct: Vextab.Parsed.IAnnotations) {
    this.texts = texts;
    this.struct = struct;
  }
}
