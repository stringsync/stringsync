import {
  vextabDecoder as VextabDecoder,
  VextabEncoder,
  VextabMeasureExtractor,
  VextabRenderer
} from './';
import { chunk } from 'lodash';

/**
 * The Vextab is the encoding used to store instructions on how to draw, animate, and edit
 * a score in StringSync. It is based on VextabStructs, which is the caller's
 * responsibility to construct. Using traditional Vextab grammar, one can use
 * Vextab.decode to produce the VextabStructs. See http://www.vexflow.com/vextab/tutorial.html
 * for the traditional grammar.
 * 
 * The initial render lifecycle of a Vextab is as follows:
 *  1. Decode a vextabString into vextabStructs
 *  2. Create vextabMeasures from the vextabStructs
 *  3. Create vextabLines from the vextabMeasures
 *  4. Create canvases that each point to a vextabLine
 *  5. Create vextab Artists
 *  6. Hydrate vextab Artists
 *  7. Create notes, measures, and lines
 *  8. Can now call vextab.render
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
  constructor(structs, measuresPerLine) {
    this.structs = Object.freeze(structs);
    this.measuresPerLine = measuresPerLine;

    this.vextabMeasures = this._computeMeasures();
    this.vextabLines = this._computeLines();
  }

  /**
   * Draws the vextab onto the canvas element.
   * 
   * @param {HTMLCanvasElement} canvas 
   */
  render(canvas) {

  }

  /**
   * Encodes a VextabStruct array into a vextab string. It is the inverse of Vextab.decode.
   *
   * @return {string}
   */
  toString() {
    return VextabEncoder.encode(this.structs);
  }

  /**
   * Called from the constructor to compute the vextabMeasures member.
   * 
   * @return {VextabMeasure[]}
   */
  _computeMeasures() {

  }

  /**
   * Called from the constructor to compute the vextabLines member.
   * 
   * @return {VextabLine[]}
   */
  _computeMeasures() {

  }
}

export default Vextab;
