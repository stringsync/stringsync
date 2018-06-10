import {
  vextabDecoder as VextabDecoder,
  VextabEncoder,
  VextabMeasureExtractor,
  VextabRenderer,
  VextabStruct
} from './';
import { Line } from 'models';
import { Flow } from 'vexflow';
import { addWindowResource } from 'utilities';

const DEFAULT_TUNING = new Flow.Tuning();

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
class Vextab {
  /**
   * Decodes a VextabString into an array of VextabStructs. It is the inverse of
   * Vextab.prototype.toString.
   *
   * @param {string} vextabString
   * @returns {VextabStruct[]}
   */
  static decode(vextabString) {
    return VextabDecoder.parse(vextabString);
  }

  /**
   * @param {VextabStruct[]} structs
   * @param {number} measuresPerLine
   */
  constructor(structs, measuresPerLine, tuning = DEFAULT_TUNING) {
    if (typeof measuresPerLine !== 'number' || measuresPerLine < 0) {
      throw new Error('measuresPerLine must be a positive number');
    } 

    this.tuning = tuning;
    this.measuresPerLine = parseInt(measuresPerLine, 10);
    this.structs = Object.freeze(structs);

    this._measures = undefined;
    this._lines = undefined;

    this.renderer = new VextabRenderer(this);

    console.warn('REMOVE FOR PRODUCTION');
    addWindowResource('vextab', this)
  }

  /**
   * Delegates the measure extracting work to the VextabMeasureExtractor
   * 
   * @returns {Measure[]}
   */
  get measures() {
    if (this._measures) {
      return this._measures;
    }

    this._measures = VextabMeasureExtractor.extract(this, this.tuning);
    return this._measures;
  }

  /**
   * Groups measures with the same measureSpec, respecting the order that the measures are in.
   * 
   * @returns {Line[]}
   */
  get lines() {
    if (this._lines) {
      return this._lines;
    }

    this._lines = [];

    let measures = [];
    let prevMeasure = null;
    this.measures.forEach((measure, ndx) => {
      const shouldPushLine = (
        measures.length === this.measuresPerLine ||
        (prevMeasure && prevMeasure.spec.struct !== measure.spec.struct) ||
        (prevMeasure && prevMeasure.spec.id !== measure.spec.id)
      );

      if (shouldPushLine) {
        this._lines.push(new Line(this._lines.length, measures));
        measures = [];
      }

      measures.push(measure);

      if (ndx === this.measures.length - 1) {
        this._lines.push(new Line(this._lines.length, measures));
      }

      prevMeasure = measure;
    });

    return this._lines;
  }

  /**
   * Encodes a VextabStruct array into a vextab string. It is the inverse of Vextab.decode.
   *
   * @returns {string}
   */
  toString() {
    return VextabEncoder.encode(this.structs);
  }
}

export default Vextab;
