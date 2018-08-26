import { Rhythm } from 'models';
import { AbstractVexWrapper, Directive, VextabElement } from 'models/vextab';
import { RestHydrationValidator } from './RestHydrationValidator';
import { id, prev, next } from 'utilities';
import { Measure, Annotations } from 'models/music';
import { get } from 'lodash';

export class Rest extends AbstractVexWrapper {
  public readonly id: number;
  public readonly type = 'REST';
  
  public position: number;
  public rhythm: Rhythm;
  public directives: Directive[] = [];
  public annotations: Annotations[] = [];
  public measure: Measure | void;

  constructor(position: number, rhythm: Rhythm) {
    super();

    this.id = id();
    this.rhythm = rhythm;
    this.position = position;
  }

  public get next(): VextabElement | null {
    return next(this, get(this.measure, 'elements', []));
  }

  public get prev(): VextabElement | null {
    return prev(this, get(this.measure, 'elements', []));
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
