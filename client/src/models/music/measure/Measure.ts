import { Bar, Note, Rest, Line, Chord } from 'models/music';
import { VextabStruct, VextabMeasureSpec } from 'models/vextab';
import { compact, get } from 'lodash';

export type MeasureElement = Note | Rest | Bar | Chord;

export class Measure {
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
    return this.elements.filter(element => (
      typeof get(element.vexAttrs, 'staveNote.getTicks') === 'function'
    ));
  }

  private getRawStruct(): Vextab.ParsedStruct[] {
    return compact(this.elements.map(element => get(element, 'struct.raw')));
  }
};
