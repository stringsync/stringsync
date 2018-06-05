import {
  vextabDecoder as VextabDecoder,
  VextabEncoder,
  VextabMeasureExtractor,
  VextabRenderer
} from './';

/**
 * The Vextab is the encoding used to store instructions on how to draw, animate, and edit
 * a score in StringSync. It is based on VextabStructs, which is the caller's
 * responsibility to construct. Using traditional Vextab grammar, one can use
 * Vextab.decode to produce the VextabStructs. See http://www.vexflow.com/vextab/tutorial.html
 * for the traditional grammar.
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
   */
  constructor(structs) {
    this.structs = structs;
    this.measures = VextabMeasureExtractor.extract(this.structs);
  }

  // TODO: Think about how we want to apply updates to the structs member, which is readonly
  // to permit undoing.

  /**
   * Draws the vextab onto the canvas element.
   * 
   * @param {HTMLCanvasElement} canvas 
   */
  render(canvas) {
    VextabRenderer.render(canvas, this.measures);
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
