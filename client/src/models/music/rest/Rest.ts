import { Rhythm } from 'models';
import { AbstractVexWrapper, VextabStruct } from 'models/vextab';

export class Rest extends AbstractVexWrapper {
  public readonly position: number;
  public readonly rhythm: Rhythm;
  public readonly type = 'REST';

  constructor(position: number, rhythm: Rhythm, struct: VextabStruct | null = null) {
    super(struct);

    this.position = position;
    this.rhythm = rhythm;
  }
  
  public hydrate(): void {
    this.vexAttrs = null;
  }
}
