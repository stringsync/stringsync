import { VextabDecoder, VextabEncoder, VextabRenderer } from './';
import { StringSyncFactory } from './string-sync-factory';
import { Line, Measure, MeasureElement } from 'models';
import { Flow } from 'vexflow';
import { VextabLinkedList } from './linked-list';
import { id } from 'utilities';
import { isEqual, flatMap, uniqWith } from 'lodash';
import { Directive } from './directive';

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

  public static encode(structs: Vextab.ParsedStruct[]) {
    return VextabEncoder.encode(structs);
  }

  public readonly rawStructs: Vextab.ParsedStruct[];
  public readonly id: number;
  public readonly measures: Measure[];
  public readonly lines: Line[];
  public readonly width: number | void;
  public readonly renderer: VextabRenderer;
  public readonly links: VextabLinkedList;

  public measuresPerLine: number;
  public tuning = DEFAULT_TUNING;

  constructor(rawStructs: Vextab.ParsedStruct[], measuresPerLine: number, width?: number | void) {
    if (typeof measuresPerLine !== 'number' || measuresPerLine < 0) {
      throw new Error('measuresPerLine must be a positive number');
    }

    this.id = id();

    this.measuresPerLine = measuresPerLine;
    this.rawStructs = rawStructs;
    this.width = width;

    this.measures = this.computeMeasures();
    this.lines = this.computeLines();

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
   * This function computes the structs based off of the StringSync data structures.
   * It will combine measures with the same measure spec with each other.
   * There are also more note elements since "time" Vextab ParsedStructs are being
   * appended to every single note.
   */
  public get structs(): Vextab.ParsedStruct[] {
    const lineGroups: Line[][] = this.lines.reduce((groups, line, ndx) => {
      const prev = this.links.prev(line) as Line | void;
      const next = this.links.next(line) as Line | void;

      // we only check the first measure since we already know that
      // a line's measures all have the same measure spec
      const shouldAppendToCurrGroup = (
        !prev ||
        !next ||
        isEqual(prev.measures[0].spec.struct, line.measures[0].spec.struct)
      );

      if (shouldAppendToCurrGroup) {
        groups[groups.length - 1].push(line);
      } else {
        groups.push([line]);
      }

      return groups;
    }, [[]] as Line[][]);

    const baseStruct: Vextab.Parsed.ILine = {
      element: 'tabstave',
      notes: [],
      options: [],
      text: []
    };

    return lineGroups.map(lineGroup => (
      lineGroup.reduce((struct, line) => {
        const { element } = struct;
        const { notes, options, text } = line.struct;

        return {
          element,
          notes: [...struct.notes, ...notes],
          options: uniqWith([...struct.options, ...options], isEqual),
          text: [...struct.text, ...text]
        }
      }, baseStruct)
    ));
  }

  /**
   * Computes all the elements of the measures
   */
  public get elements(): MeasureElement[] {
    return flatMap(this.measures, measure => measure.elements);
  }

  /**
   * Encodes a VextabStruct array into a vextab string. It is the inverse of Vextab.decode.
   *
   * @returns {string}
   */
  public toString(): string {
    return Vextab.encode(this.structs);
  }

  /**
   * Returns a cloned Vextab.
   */
  public clone(): Vextab {
    return new Vextab(this.structs, this.measuresPerLine, this.width);
  }

  /**
   * Creates fake canvases to generate the Vexflow data structures needed to hydrate
   * each note.
   */
  public psuedorender(): void {
    if (this.renderer.isRendered) {
      throw new Error('cannot psuedorender a rendered vextab')
    }

    this.lines.forEach(line => this.renderer.assign(line, document.createElement('canvas')));
    Directive.extractAndInvoke(this);
    this.renderer.render();
    this.links.compute();
  }

  /**
   * Delegates the measure extracting work to the StringSyncFactory
   * 
   * @returns {Measure[]}
   */
  private computeMeasures(): Measure[] {
    return StringSyncFactory.extract(this, this.tuning);
  }

  /**
   * Groups measures with the same measureSpec, respecting the order that the measures are in.
   * 
   * @returns {Line[]}
   */
  private computeLines(): Line[] {
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
