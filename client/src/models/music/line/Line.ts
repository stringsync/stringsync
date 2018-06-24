import { Measure } from 'models/music';

export class Line {
  public id: number;
  public measures: Measure[];
  public readonly type = 'LINE';
  public readonly struct: any;

  constructor(id: number, measures: Measure[]) {
    this.id = id;
    this.measures = measures;

    this.struct = this.computeStruct();
  }

  private computeStruct(): Vextab.Parsed.ILine {
    // notes are measure struct!
    const notes = this.measures.reduce<any[]>((measureStructs, measure) => {
      measureStructs.concat(measure.struct);
      return measureStructs;
    }, []);
    const options = this.measures.length === 0 ? [] : this.measures[0].spec.struct.raw;

    return {
      element: 'tabstave',
      notes,
      options,
      text: []
    }
  }
}

export default Line;
