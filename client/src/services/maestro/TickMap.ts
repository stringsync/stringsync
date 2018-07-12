import { Vextab, Line, Measure, Note, MeasureElement } from 'models';

export interface ITickData {
  start: number;
  stop: number;
  line: Line;
  measure: Measure;
  note: MeasureElement;
}

/**
 * One of the main problems in StringSync involves compute values based on the currentTick value
 * of the media that's playing. One of the solutions is to compute everything up front, then
 * query it later.
 * 
 * We accomplish this by breaking the tickable vexflow notes into tick ranges. We'll take each
 * tick range and map them in such a way that we can retrieve the corresponding properties
 * with relative ease.
 * 
 * The TickMap is a mapping ranges to objects of line, measure, and note. The backing data
 * structures are populated on construction. This class also provides a simple interface to
 * query data given a Time object.
 */
export class TickMap {
  public vextab: Vextab;
  public data: ITickData[];

  constructor(vextab: Vextab) {
    this.vextab = vextab;
  }

  /**
   * Called after the vextab is hydrated, which is after each line gets assigned a canvas.
   */
  public compute(): void {
    this.data = this.getData();
  }

  /**
   * The primary interface for TickMap. Given a tick value, this function will return tick
   * data that that tick is in between. This function will throw a RangeError if data
   * could not be found. It is up to the caller to handle RangeErrors.
   * 
   * @param tick
   */
  public fetch(tick: number): ITickData {
    const data = this.data.find(({ start, stop }) => start <= tick && tick < stop);

    if (!data) {
      throw new RangeError(`out of range: could not find data for ${tick}`);
    }

    return data;
  }

  /**
   * Computes the backing data structure for this class. It should only be called
   * from the constructor.
   */
  private getData(): ITickData[] {
    const data: ITickData[] = [];
    let totalTicks = 0; // accumulator 

    this.vextab.lines.forEach(line => {
      line.measures.forEach(measure => {
        measure.tickables.forEach(note => {
          if (!note.isHydrated) {
            throw new Error('expected note to be hydrated');
          }
          
          const start = totalTicks;
          const stop = totalTicks + note.vexAttrs!.staveNote.getTicks().quotient();

          data.push({ line, measure, note, start, stop });

          totalTicks = stop; // increment accumulator
        });
      });
    });

    return data;
  }
}