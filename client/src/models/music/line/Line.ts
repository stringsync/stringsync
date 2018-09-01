import { Vextab, Measure } from 'models';
import { next, prev } from 'utilities';
import { get, uniqWith, isEqual } from 'lodash';

/**
 * The purpose of this class is to manage a group of measures.
 */
export class Line {
  public readonly type = 'LINE';

  public measures: Measure[];
  public stave: Vex.Flow.Stave;
  public vextab: Vextab | void;

  constructor(measures: Measure[]) {
    this.measures = measures;
  }

  public get index(): number {
    const lines = get(this.vextab, 'lines', []);
    return lines.indexOf(this);
  }

  public get next(): Line | null {
    return next(this, get(this.vextab, 'lines', []));
  }

  public get prev(): Line | null {
    return prev(this, get(this.vextab, 'lines', []));
  }

  public get struct(): Vextab.Parsed.IStave {
    // notes are measure struct!
    const notes = this.measures.reduce((structs, measure) => structs.concat(measure.struct), [] as Vextab.Parsed.Note[]);

    // element is always the same
    const element = 'tabstave';

    // compute options
    const optionsStructs = uniqWith(this.measures.map(measure => measure.optionsStruct), isEqual);

    if (optionsStructs.length > 1) {
      throw new Error('expected 1 optionsStruct for measures on the same line')
    }

    const options = optionsStructs[0];

    // compute text (not supported yet)
    const text: any[] = [];

    return { element, notes, options, text }
  }

  public clone(): Line {
    const measures = this.measures.map(measure => measure.clone());
    return new Line(measures);
  }
}

export default Line;
