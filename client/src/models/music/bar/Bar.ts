import { VextabStruct, AbstractVexWrapper } from 'models/vextab';
import { BarHydrationValidator } from './BarHydrationValidator';
import { id } from 'utilities';
import { Measure } from 'models/music';
import { Annotations } from '../annotations';

export class Bar extends AbstractVexWrapper {
  public static kindof(note: Vextab.Parsed.IBar): Vex.Flow.Barline.type {
    switch (note.type.toUpperCase()) {
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

  public readonly type = 'BAR';
  public readonly id: number;

  public kind: Vex.Flow.Barline.type;
  public measure: Measure | void;
  public directives: Directive.IDirective[] = [];
  public annotations: Annotations[] = [];

  constructor(kind: Vex.Flow.Barline.type, struct: VextabStruct | null = null) {
    super(struct);

    this.id = id();
    this.kind = kind;
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
