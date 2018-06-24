import { Bar, Note, Rest, TimeSignature } from 'models/music';

export type MeasureElement = Note | Rest;

export class Measure {
  public elements: MeasureElement[];
  public bar: Bar;
  // public struct: Vextab.Parsed.Note[];
  public readonly type = 'MEASURE';

  constructor(timeSignature: TimeSignature, elements: MeasureElement[], bar: Bar) {
    this.elements = elements;
    this.bar = bar;

    // this.struct = this.computeStruct();
  }

  // FIXME: Fix when ready
  // private computeStruct(): Vextab.Parsed.Note[] {
  //   return [
  //     this.bar.struct.raw,
  //     ...this.elements.map(element => element.struct.raw)
  //   ]
  // }
};
