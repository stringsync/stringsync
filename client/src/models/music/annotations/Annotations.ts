import { VextabStruct, AbstractVexWrapper } from 'models/vextab';

export class Annotations extends AbstractVexWrapper {
  public readonly texts: string[];
  public readonly type = 'ANNOTATIONS';

  constructor(texts: string[], struct: VextabStruct | null = null) {
    super(struct);

    this.texts = texts;
  }

  public hydrate(): void {
    this.vexAttrs = null;
  }
}
