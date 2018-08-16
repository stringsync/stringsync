import { VextabStruct, AbstractVexWrapper } from 'models/vextab';
import { BarHydrationValidator } from './BarHydrationValidator';
import { id } from 'utilities';
import { Measure } from 'models/music';
import { Annotations } from '../annotations';

export class Bar extends AbstractVexWrapper {
  public readonly type = 'BAR';
  public readonly id: number;

  public kind: Vextab.Parsed.IBarTypes;
  public measure: Measure | void;
  public directives: Directive.IDirective[] = [];
  public annotations: Annotations[] = [];

  constructor(kind: Vextab.Parsed.IBarTypes) {
    super();

    this.id = id();
    this.kind = kind;
  }

  public get struct(): Vextab.Parsed.IBar {
    return { command: 'bar', type: this.kind };
  }

  public hydrate(staveNote: Vex.Flow.BarNote, tabNote: Vex.Flow.BarNote): void {
    const validator = new BarHydrationValidator(this, staveNote, tabNote);

    validator.validate();

    if (validator.isValid) {
      this.vexAttrs = { staveNote, tabNote };
    } else {
      throw validator.errors;
    }
  }
}
