import { Bar, Note, Rest, Line, Chord } from 'models/music';
import { VextabMeasureSpec, Vextab, Directive } from 'models/vextab';
import { compact, get, flatMap } from 'lodash';
import { Annotations } from '../annotations';

export type MeasureElement = Note | Rest | Bar | Chord;

export class Measure {
  public static tickableTypes = ['NOTE', 'CHORD', 'REST'];

  public readonly spec: VextabMeasureSpec;
  public readonly id: number;
  public readonly type = 'MEASURE';

  public line: Line | void;
  public elements: MeasureElement[];
  public annotations: Annotations[] = [];
  public directives: Directive[] = [];

  constructor(elements: MeasureElement[], id: number, spec: VextabMeasureSpec) {
    if (elements[0].type !== 'BAR') {
      throw new Error(`expected the first element to have type BAR, got: ${elements[0].type}`);
    }
    
    this.id = id;
    this.elements = elements;
    this.spec = spec;
  }

  public get tickables(): Array<Note | Chord | Rest> {
    const tickableTypes = new Set(Measure.tickableTypes);
    return this.elements.filter(element => tickableTypes.has(element.type)) as Array<Note | Chord| Rest>;
  }

  /**
   * Iterates through the Chord and Note elements, and flat maps their pos getters.
   */
  public get positions(): Guitar.IPosition[] {
    const targets = this.elements.filter(element => (
      element.type === 'NOTE' || element.type === 'CHORD'
    )) as Array<Chord | Note>;

    return flatMap(targets, target => target.positions);
  }

  public get struct(): Vextab.ParsedStruct[] {
    return flatMap(this.elements, element => {
      if (get(element, 'rhythm.isGrace', false)) {
        return [];
      } else {
        return compact([
          get(element, 'rhythm.struct'),
          element.struct,
          ...element.annotations.map(annotation => annotation.struct),
        ])
      }
    });
  }
};
