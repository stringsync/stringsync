import { Rhythm } from 'models';
import { AbstractVexWrapper, VextabStruct } from 'models/vextab';
import { RestHydrationValidator } from './RestHydrationValidator';
import { id } from 'utilities';
import { Measure } from 'models/music';

export class Rest extends AbstractVexWrapper {
  public readonly position: number;
  public readonly rhythm: Rhythm;
  public readonly id: number;
  public readonly type = 'REST';

  public measure: Measure | void;

  constructor(position: number, rhythm: Rhythm, struct: VextabStruct | null = null) {
    super(struct);

    this.id = id();
    this.position = position;
    this.rhythm = rhythm;
  }
  
  public hydrate(staveNote: Vex.Flow.StaveNote, tabNote: Vex.Flow.TabNote): void {
    const validator = new RestHydrationValidator(this, staveNote, tabNote);

    validator.validate();

    if (validator.isValid) {
      this.vexAttrs = { staveNote, tabNote };
    } else {
      throw validator.errors;
    }
  }
}
