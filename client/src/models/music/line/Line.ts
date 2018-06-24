import { Measure } from 'models/music';
import { Vextab } from 'models/vextab';

export class Line {
  public id: number;
  public measures: Measure[];
  public rawStruct: Vextab.Parsed.ILine;
  public readonly type = 'LINE';
  public readonly struct: any;

  constructor(id: number, measures: Measure[]) {
    this.id = id;
    this.measures = measures;

    this.rawStruct = this.getRawStruct();
  }

  private getRawStruct(): Vextab.Parsed.ILine {
    // notes are measure struct!
    const notes = this.measures.reduce<any[]>((measureStructs, measure) => {
      measureStructs.concat(measure.rawStruct);
      return measureStructs;
    }, []);
    const options = this.measures.length === 0 ? [] : this.measures[0].spec.struct.raw;

    return {
      element: 'tabstave',
      notes,
      options,
      text: []
    };
  };
}

export default Line;
