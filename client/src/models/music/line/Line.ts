import { Measure } from 'models/music';

export class Line {
  public id: number;
  public measures: Measure[];
  public readonly type = 'LINE';
  public readonly spec: any;

  constructor(id: number, measures: Measure[], spec: any) {
    this.id = id;
    this.measures = measures;
  }

  // FIXME: Fix when ready 
  // private computeStruct(): Vextab.Parsed.ILine {
  //   // notes are measure struct!
  //   const notes = this.measures.reduce((measureStructs, measure) => {
  //     return measureStructs.concat(measure.struct);
  //   }, []);
  //   const options = this.measures.length === 0 ? [] : this.measures[0].spec.struct.raw;

  //   return {
  //     element: 'tabstave',
  //     notes,
  //     options,
  //     text: []
  //   }
  // }
}

export default Line;
