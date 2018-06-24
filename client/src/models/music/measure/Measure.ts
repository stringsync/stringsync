import { Bar, Note, Rest, TimeSignature } from 'models/music';

export type MeasureElement = Note | Rest;

export class Measure {
  public elements: MeasureElement[];
  public bar: Bar;
  public struct: Vextab.Parsed.Note[];
  public readonly spec: any;
  public readonly type = 'MEASURE';

  constructor(timeSignature: TimeSignature, elements: MeasureElement[], bar: Bar, spec: any) {
    this.elements = elements;
    this.bar = bar;
    this.spec = spec;

    this.struct = this.computeStruct();
  }

  private computeStruct(): Vextab.Parsed.Note[] {
    return [
      // (this.bar.struct as any).raw,
      // ...this.elements.map((element: any) => element.struct.raw)
    ]
  }
};
