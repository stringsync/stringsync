import { Bar, Note, Rest, Line, Chord } from 'models/music';
import { VextabMeasureSpec } from 'models/vextab';
import { compact, get, flatMap } from 'lodash';

export type MeasureElement = Note | Rest | Bar | Chord;

export class Measure {
  public static tickableTypes = ['NOTE', 'CHORD', 'REST'];

  public readonly spec: any;
  public readonly rawStruct: Vextab.ParsedStruct[];
  public readonly id: number;
  public readonly type = 'MEASURE';

  public line: Line | void;

  public elements: MeasureElement[];

  constructor(elements: MeasureElement[], id: number, spec: VextabMeasureSpec) {
    if (elements[0].type !== 'BAR') {
      throw new Error(`expected the first element to have type BAR, got: ${elements[0].type}`);
    }
    
    this.id = id;
    this.elements = elements;
    this.spec = spec;

    this.rawStruct = this.getRawStruct();
  }

  public get tickables(): MeasureElement[] {
    const tickableTypes = new Set(Measure.tickableTypes);
    return this.elements.filter(element => tickableTypes.has(element.type));
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

  private getRawStruct(): Vextab.ParsedStruct[] {
    return flatMap(this.elements, element => (
      compact([
        get(element, 'rhythm.struct.raw'),
        get(element, 'struct.raw'),
        ...element.annotations.map(annotation => get(annotation, 'struct.raw'))
      ])
    ));
  }
};
