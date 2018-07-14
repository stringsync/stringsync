import {
  VextabDecoder,
  VextabEncoder,
  VextabMeasureExtractor,
  VextabRenderer,
} from './';
import { Line, MeasureElement } from 'models';
import { Flow } from 'vexflow';
import { Measure } from '../music/measure/Measure';
import { hash } from 'utilities';
import { Note } from 'models/music';
import { flatMap } from 'lodash';
import { VextabLinkedList } from './linked-list';

const DEFAULT_TUNING: Vex.Flow.Tuning = new (Flow as any).Tuning();

let VEXTAB_ID_BASE = 0;
const getVextabId = () => hash((VEXTAB_ID_BASE++).toString());

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

  public readonly structs: Vextab.ParsedStruct[];
  public readonly id: number;
  public readonly measures: Measure[];
  public readonly lines: Line[];

  public measuresPerLine: number;
  public tuning = DEFAULT_TUNING;
  public renderer: VextabRenderer;
  public links: VextabLinkedList;

  constructor(structs: Vextab.ParsedStruct[], measuresPerLine: number) {
    if (typeof measuresPerLine !== 'number' || measuresPerLine < 0) {
      throw new Error('measuresPerLine must be a positive number');
    }

    this.id = getVextabId();

    this.measuresPerLine = measuresPerLine;
    this.structs = structs;

    this.measures = this.getMeasures();
    this.lines = this.getLines();

    this.renderer = new VextabRenderer(this);
    this.links = new VextabLinkedList(this.lines, this.measures);
  }

  /**
   * Returns the next logical element based on the src type.
   * 
   * @param src A line, measure, or note
   * @param tickable If src is a Note, then 
   */
  public next(src: Line | Measure | MeasureElement, tickable?: boolean): Line | Measure | MeasureElement | void {
    let ndx: number;
    let measures: Measure[];
    let notes: MeasureElement[];

    switch(src.type) {
      case 'LINE':
        ndx = this.lines.indexOf(src as Line);
        return ndx === -1 ? undefined : this.lines[ndx + 1];
      case 'MEASURE':
        measures = flatMap(this.lines, line => line.measures);
        ndx = measures.indexOf(src as Measure);
        return ndx === -1 ? undefined : measures[ndx + 1];
      case 'NOTE':
        measures = flatMap(this.lines, line => line.measures);
        notes = flatMap(measures, measure => tickable ? measure.tickables : measure.elements);
        ndx = notes.indexOf(src as MeasureElement);
        return ndx === -1 ? undefined : notes[ndx + 1];
      default:
        break;
    }
  }

  /**
   * Encodes a VextabStruct array into a vextab string. It is the inverse of Vextab.decode.
   *
   * @returns {string}
   */
  public toString(): string {
    return VextabEncoder.encode(this.structs);
  }

  /**
   * Delegates the measure extracting work to the VextabMeasureExtractor
   * 
   * @returns {Measure[]}
   */
  private getMeasures(): Measure[] {
    return VextabMeasureExtractor.extract(this, this.tuning);
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
        (prevMeasure && prevMeasure.spec.struct !== measure.spec.struct) ||
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
