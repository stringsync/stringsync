import { Bar, Note, Rest } from 'models/music';
import { VextabStruct, VextabMeasureSpec } from 'models/vextab';
import { compact, get } from 'lodash';

export type MeasureElement = Note | Rest | Bar;

export class Measure {
  public elements: MeasureElement[];
  public readonly spec: any;
  public readonly rawStruct: Vextab.ParsedStruct[];
  public readonly type = 'MEASURE';

  constructor(elements: MeasureElement[], spec: VextabMeasureSpec) {
    if (elements[0].type !== 'BAR') {
      throw new Error(`expected the first element to have type BAR, got: ${elements[0].type}`);
    } 

    this.elements = elements;
    this.spec = spec;

    this.rawStruct = this.getRawStruct();
  }

  private getRawStruct(): Vextab.ParsedStruct[] {
    return compact(this.elements.map(element => get(element, 'struct.raw')));
  }
};
