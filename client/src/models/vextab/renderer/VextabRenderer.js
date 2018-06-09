class VextabRenderer {
  constructor(vextab) {
    this.vextab = vextab;
    this.canvasesByLineNumber = {};
  }

  /**
   * The interface to populate canvasesByLineNumber.
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {number} lineNumber 
   * @return {void}
   */
  assign(canvas, lineNumber) {
    this.canvasesByLineNumber[lineNumber] = canvas;
  }

  /**
   * First, validates to ensure that all lines have a canvas. Throws an error if there are not enough
   * canvases.
   * 
   * @return {void}
   */
  render() {

  }
};

export default VextabRenderer;
