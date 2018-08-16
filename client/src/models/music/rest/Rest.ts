import { Rhythm } from 'models';
import { AbstractVexWrapper, VextabStruct } from 'models/vextab';
import { RestHydrationValidator } from './RestHydrationValidator';
import { id } from 'utilities';
import { Measure } from 'models/music';
import { Annotations } from '../annotations';
import { Tuplet } from '../tuplet';

export class Rest extends AbstractVexWrapper {
  public readonly position: number;
  public readonly id: number;
  public readonly type = 'REST';
  
  public rhythm: Rhythm;
  public measure: Measure | void;
  public directives: Directive.IDirective[] = [];
  public annotations: Annotations[] = [];
  public tuplet: Tuplet | void;

  constructor(position: number, rhythm: Rhythm, struct: VextabStruct | null = null) {
    super(struct);

    this.id = id();
    this.rhythm = rhythm;
    this.position = position;
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
