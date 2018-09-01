import { AbstractVexWrapper } from 'models/vextab';

export class Annotations extends AbstractVexWrapper {
  public readonly texts: string[];
  public readonly type = 'ANNOTATIONS';

  constructor(texts: string[]) {
    super();

    this.texts = texts;
  }

  public get struct(): Vextab.Parsed.IAnnotations {
    return { command: 'annotations', params: this.texts }
  }

  public clone(): Annotations {
    return new Annotations([...this.texts]);
  }

  // TODO: Create a validator for this hydrate function.
  public hydrate(staveNote: Vex.Flow.StaveNote, tabNote: Vex.Flow.TabNote): void {
    this.vexAttrs = { staveNote, tabNote };
  }
}
