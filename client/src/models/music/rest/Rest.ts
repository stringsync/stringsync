import { Rhythm } from 'models';
import { AbstractVexWrapper, Struct, Directive } from 'models/vextab';
import { RestHydrationValidator } from './RestHydrationValidator';
import { id } from 'utilities';
import { Measure } from 'models/music';
import { Annotations } from '../annotations';
import { Tuplet } from '../tuplet';

export class Rest extends AbstractVexWrapper {
  public readonly id: number;
  public readonly type = 'REST';
  
  public position: number;
  public rhythm: Rhythm;
  public measure: Measure | void;
  public directives: Directive[] = [];
  public annotations: Annotations[] = [];
  public tuplet: Tuplet | void;

  constructor(position: number, rhythm: Rhythm) {
    super();

    this.id = id();
    this.rhythm = rhythm;
    this.position = position;
  }

  public get struct(): Vextab.Parsed.IRest {
    return {
      command: 'rest',
      params: {
        position: this.position
      }
    }
  }

  public clone(): Rest {
    const rest = new Rest(this.position, this.rhythm.clone());

    const annotations = this.annotations.map(annotation => annotation.clone());
    const directives = this.directives.map(directive => directive.clone(rest));

    rest.annotations = annotations;
    rest.directives = directives;

    return rest;
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
