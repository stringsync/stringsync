export class Annotations {
  public texts: string[];
  public readonly type = 'ANNOTATIONS';

  constructor(texts: string[]) {
    this.texts = texts;
  }
}
