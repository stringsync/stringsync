import { Flow } from 'vexflow';
import { VexTab as VextabGenerator, Artist } from 'vextab/releases/vextab-div.js';

Artist.NO_LOGO = true;

const CANVAS_BACKEND = Flow.Renderer.Backends.CANVAS;

class VextabRenderer {
  constructor(vextab) {
    this.vextab = vextab;
    this.canvasesByLineNumber = {};
    this.artistsByLineNumber = {};
  }

  /**
   * The interface to populate canvasesByLineNumber.
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {number} lineNumber 
   * @returns {void}
   */
  assign(canvas, lineNumber) {
    this.canvasesByLineNumber[lineNumber] = canvas;
  }

  /**
   * This is the step used to create all the artists, which are ultimately used to render to
   * the canvas. It will also assign all the Vexflow element to the wrapper model elements.
   * 
   * @returns {void}
   */
  hydrate() {
    this.vextab.lines.forEach(line => {
      const artist = new Artist(10, 20, 980);
      this.artistsByLineNumber[line.number] = artist; 
      const vextabGenerator = new VextabGenerator(artist);

      // See https://github.com/0xfe/vextab/blob/master/src/vextab.coffee#L204
  
      vextabGenerator.elements = line.struct;
      vextabGenerator.generate();
    });
  }

  /**
   * First, validates to ensure that all lines have a canvas. Throws an error if there are not
   * enough canvases.
   * 
   * @returns {void}
   */
  render() {
    
  }
};

export default VextabRenderer;
