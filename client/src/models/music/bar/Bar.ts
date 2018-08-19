import { AbstractVexWrapper, Directive } from 'models/vextab';
import { BarHydrationValidator } from './BarHydrationValidator';
import { id } from 'utilities';
import { Measure } from 'models/music';
import { Annotations } from '../annotations';

export class Bar extends AbstractVexWrapper {
  public readonly type = 'BAR';
  public readonly id: number;

  public kind: Vextab.Parsed.IBarTypes;
  public measure: Measure | void;
  public directives: Directive[] = [];
  public annotations: Annotations[] = [];

  constructor(kind: Vextab.Parsed.IBarTypes) {
    super();

    this.id = id();
    this.kind = kind;
  }

  /**
   * Used to compare to Vexflow data structures that use the getType function.
   */
  public getType(): Vex.Flow.Barline.type {
    switch (this.kind.toUpperCase()) {
      case 'SINGLE':
        return Vex.Flow.Barline.type.SINGLE;
      case 'DOUBLE':
        return Vex.Flow.Barline.type.DOUBLE;
      case 'END':
        return Vex.Flow.Barline.type.END;
      case 'REPEAT-END':
        return Vex.Flow.Barline.type.REPEAT_END;
      case 'REPEAT-BEGIN':
        return Vex.Flow.Barline.type.REPEAT_BEGIN;
      case 'REPEAT-BOTH':
        return Vex.Flow.Barline.type.REPEAT_BOTH;
      default:
        return Vex.Flow.Barline.type.REPEAT_BOTH;
    }
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
