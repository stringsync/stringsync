import {
  vextabDecoder as VextabDecoder,
  VextabEncoder,
  VextabMeasureExtractor,
  VextabRenderer,
  VextabStruct
} from './';
import { chunk, merge, takeRight } from 'lodash';
import { Measure, Line, Note, TimeSignature, Bar, Rhythm, Chord, Rest } from 'models';
import { Flow } from 'vexflow';

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
   * @return {VextabStruct[]}
   */
  static decode(vextabString) {
    return VextabDecoder.parse(vextabString);
  }

  /**
   * @param {VextabStruct[]} structs
   * @param {number} measuresPerLine
   */
  constructor(structs, measuresPerLine, tuning = new Flow.Tuning()) {
    this.tuning = tuning;
    this.measuresPerLine = measuresPerLine;

    this._structs = Object.freeze(structs);
    this._measures = undefined;
    this._lines = undefined;

    this.renderer = new VextabRenderer(this);

    if (window.ss.env === 'development') {
      console.warn('REMOVE BEFORE DEPLOY');
      window.ss.vextab = this;
    }
  }

  /**
   * Returns a clone of structs instance variable.
   * 
   * @return {VextabStruct[][]}
   */
  get structs() {
    return merge([], this._structs); 
  }

  get measures() {
    if (this._measures) {
      return this._measures;
    }

    this._measures = VextabMeasureExtractor.extract(this.structs);
    return this._measures;
  }

  get lines() {
    if (this._lines) {
      return this._lines;
    }

    this._lines = chunk(this.measures, this.measuresPerLine).map((measures, number) => {
      return new Line(measures, number);
    });

    return this._lines;
  }

  /**
   * Encodes a VextabStruct array into a vextab string. It is the inverse of Vextab.decode.
   *
   * @return {string}
   */
  toString() {
    return VextabEncoder.encode(this.structs);
  }
}

export default Vextab;
