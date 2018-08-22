import { Measure } from 'models/music';
import { Vextab } from '../../vextab';

export class Line {
  public id: number;
  public measures: Measure[];
  public stave: Vex.Flow.Stave;
  public readonly type = 'LINE';

  constructor(id: number, measures: Measure[]) {
    this.id = id;
    this.measures = measures;
  }

  public get struct(): Vextab.Parsed.ILine {
    // notes are measure struct!
    const notes = this.measures.reduce<Vextab.Parsed.Note[]>((measureStructs, measure) => {
      return measureStructs.concat(measure.struct);
    }, []);

    const options = this.measures.length === 0 ? [] : this.measures[0].spec.struct

    return {
      element: 'tabstave',
      notes,
      options,
      text: [] // Not supported yet
    };
  };
}

export default Line;
