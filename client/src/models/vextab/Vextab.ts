import {
  VextabDecoder,
  VextabEncoder,
  MeasureExtractor,
  VextabRenderer,
} from './';
import { Line, MeasureElement } from 'models';
import { Flow } from 'vexflow';
import { Measure } from '../music/measure/Measure';
import { VextabLinkedList } from './linked-list';
import { id } from 'utilities';
import { isEqual } from 'lodash';

const DEFAULT_TUNING: Vex.Flow.Tuning = new (Flow as any).Tuning();

/**
 * The Vextab is the encoding used to store instructions on how to draw, animate, and edit
 * a score in StringSync. It is based on VextabStructs, which is the caller's
 * responsibility to construct. Using traditional Vextab grammar, one can use
 * Vextab.decode to produce the VextabStructs. See http://www.vexflow.com/vextab/tutorial.html
 * for the traditional grammar.
 * 
 * The initial render lifecycle of a Vextab is as follows:
 *  1. Decode a vextabString into vextabStructs
 *  2. Create measures: Measure[] from the vextabStructs
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
  /**
   * Decodes a VextabString into an array of VextabStructs. It is the inverse of
   * Vextab.prototype.toString.
   *
   * @param {string} vextabString
   * @returns {VextabStruct[]}
   */
  public static decode(vextabString: string): Vextab.ParsedStruct[] {
    return (VextabDecoder as any).parse(vextabString);
  }

  public readonly rawStructs: Vextab.ParsedStruct[];
  public readonly id: number;
  public readonly measures: Measure[];
  public readonly lines: Line[];
  public readonly width: number | void;

  public measuresPerLine: number;
  public tuning = DEFAULT_TUNING;
  public renderer: VextabRenderer;
  public links: VextabLinkedList;

  constructor(rawStructs: Vextab.ParsedStruct[], measuresPerLine: number, width?: number | void) {
    if (typeof measuresPerLine !== 'number' || measuresPerLine < 0) {
      throw new Error('measuresPerLine must be a positive number');
    }

    this.id = id();

    this.measuresPerLine = measuresPerLine;
    this.rawStructs = rawStructs;
    this.width = width;

    this.measures = this.getMeasures();
    this.lines = this.getLines();

    // Link lines with measures
    this.lines.forEach(line => {
      line.measures.forEach(measure => measure.line = line);
    });

    // Link measure elements with measures
    this.measures.forEach(measure => {
      measure.elements.forEach(element => element.measure = measure);
    })

    this.renderer = new VextabRenderer(this, width);
    this.links = new VextabLinkedList(this.lines, this.measures);
  }

  /**
   * This method returns the computed structs, not the rawStructs.
   */
  public get structs(): Vextab.ParsedStruct[] {
    return this.lines.map(line => line.struct);
  }

  /**
   * Encodes a VextabStruct array into a vextab string. It is the inverse of Vextab.decode.
   *
   * @returns {string}
   */
  public toString(): string {
    return VextabEncoder.encode(this.rawStructs);
  }

  /**
   * Delegates the measure extracting work to the MeasureExtractor
   * 
   * @returns {Measure[]}
   */
  private getMeasures(): Measure[] {
    return MeasureExtractor.extract(this, this.tuning);
  }

  /**
   * Groups measures with the same measureSpec, respecting the order that the measures are in.
   * 
   * @returns {Line[]}
   */
  private getLines(): Line[] {
    const lines: Line[] = [];
    let measures: Measure[] = [];

    let prevMeasure: Measure | null = null;
    this.measures.forEach((measure, ndx) => {
      const shouldPushLine = (
        measures.length === this.measuresPerLine ||
        (prevMeasure && !isEqual(prevMeasure.spec.struct, measure.spec.struct)) ||
        (prevMeasure && prevMeasure.spec.id !== measure.spec.id)
      );

      if (shouldPushLine) {
        lines.push(new Line(lines.length, measures));
        measures = [];
      }

      measures.push(measure);

      if (ndx === this.measures.length - 1) {
        lines.push(new Line(lines.length, measures));
      }

      prevMeasure = measure;
    });

    return lines;
  }
}
