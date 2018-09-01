import { VextabDecoder, VextabEncoder, VextabRenderer, Factory } from './';
import { Line, Measure } from 'models';
import { flatMap } from 'lodash';
import { Note, Chord, Rest } from 'models';
import { id } from 'utilities';
import { Directive } from './directive';

export type VextabElement = Note | Chord | Rest;

/**
 * The Vextab is the encoding used to store instructions on how to draw, animate, and edit
 * a score in StringSync. It is based on Structs, which is the caller's
 * responsibility to construct. Using traditional Vextab grammar, one can use
 * Vextab.decode to produce the Structs. See http://www.vexflow.com/vextab/tutorial.html
 * for the traditional grammar.
 * 
 * The initial render lifecycle of a Vextab is as follows:
 *  1. Decode a vextabString into Structs
 *  2. Create measures: Measure[] from the Structs
 *  3. Create canvases that each point to a vextabLine
 *  4. Create vextab Artists
 *  5. Hydrate vextab Artists
 *  6. Create notes, measures, and lines
 *  7. Can now call vextab.render
 * 
 * Renderers live at the line (not VextabLine) level.
 * 
 * Do not change the internal state of Vextab. Instead, clone the structs member, update the clone,
 * and create a new Vextab instance.
 */
export class Vextab {
  public static decode(vextabString: string): Vextab.Parsed.IStave[] {
    return (VextabDecoder as any).parse(vextabString);
  }

  public static encode(structs: Vextab.Parsed.IStave[]): string {
    return VextabEncoder.encode(structs);
  }

  public readonly id: number;
  public readonly width: number;
  public readonly renderer: VextabRenderer;
  public readonly measuresPerLine: number;
  public readonly tuning: Vex.Flow.Tuning;
  public lines: Line[];

  constructor(lines: Line[], tuning: Vex.Flow.Tuning, measuresPerLine: number, width: number) {
    if (measuresPerLine < 0) {
      throw new Error('measuresPerLine must be a positive number');
    }

    this.id = id();
    this.lines = lines;
    this.tuning = tuning;
    this.measuresPerLine = measuresPerLine;
    this.width = width;

    // Create auxillary data structures
    this.renderer = new VextabRenderer(this, width);

    // associate all the inner models with each other
    this.lines.forEach(line => {
      line.vextab = this;
      line.measures.forEach(measure => {
        measure.line = line;
        measure.elements.forEach(element => element.measure = measure)
      })
    })
  }

  public get structs(): Vextab.Parsed.IStave[] {
    return this.lines.map(line => line.struct);
  }

  public get measures(): Measure[] {
    return flatMap(this.lines, line => line.measures);
  }

  public get elements(): VextabElement[] {
    return flatMap(this.measures, measure => measure.elements);
  }

  /**
   * Encodes a Struct array into a vextab string. It is the inverse of Vextab.decode.
   *
   * @returns {string}
   */
  public toString(): string {
    return Vextab.encode(this.structs);
  }

  public clone(): Vextab {
    const factory = new Factory(this.structs, this.tuning, this.measuresPerLine, this.width);
    return factory.newInstance();
  }

  public psuedorender() {
    this.lines.forEach(line => {
      const canvas = document.createElement('canvas');
      this.renderer.assign(line, canvas);
    });

    Directive.extractAndInvoke(this);
    this.renderer.render();
  }
}
