import { AbstractVexWrapper, Directive } from 'models/vextab';
import { BarHydrationValidator } from './BarHydrationValidator';
import { Measure, Annotations, Key, TimeSignature } from 'models/music';
import { id } from 'utilities';

export class Bar extends AbstractVexWrapper {
  public static KINDS = [
    'single',
    'double',
    'end',
    'repeat-end',
    'repeat-begin',
    'repeat-both'
  ];

  public readonly type = 'BAR';
  public readonly id: number;

  public kind: Vextab.Parsed.IBarTypes;
  public key: Key;
  public timeSignature: TimeSignature;
  public directives: Directive[] = [];
  public annotations: Annotations[] = [];

  constructor(kind: Vextab.Parsed.IBarTypes, key: Key, timeSignature: TimeSignature) {
    super();

    this.id = id();
    this.kind = kind;
    this.key = key;
    this.timeSignature = timeSignature;
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

  public clone(): Bar {
    const bar = new Bar(this.kind, this.key.clone(), this.timeSignature.clone());

    const annotations = this.annotations.map(annotation => annotation.clone());
    const directives = this.directives.map(directive => directive.clone(bar));

    bar.annotations = annotations;
    bar.directives = directives;

    return bar;
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
