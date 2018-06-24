import { Flow } from 'vexflow';
import { Vextab } from 'models/vextab';
import { VexTab as VextabGenerator, Artist } from 'vextab/releases/vextab-div.js';

Artist.NO_LOGO = true;

const CANVAS_BACKEND = (Flow as any).Renderer.Backends.CANVAS;

export class VextabRenderer {
  public readonly vextab: Vextab;

  private canvasesByLineId: { [lineId: string]: HTMLCanvasElement };
  private artistsByLineId: { [lineId: string]: any };

  constructor(vextab: Vextab) {
    this.vextab = vextab;
    this.canvasesByLineId = {};
    this.artistsByLineId = {};
  }

  get missingCanvses(): number[] {
    return this.vextab.lines.map(line => line.id).filter(id => (
      !this.canvasesByLineId[id]
    ));
  }

  /**
   * The interface to populate canvasesByLineId. It will automatically 
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {number} lineNumber 
   * @returns {void}
   */
  public assign(canvas: HTMLCanvasElement, lineId: number): void {
    this.canvasesByLineId[lineId] = canvas;
  }

  /**
   * First, validates to ensure that all lines have a canvas. Throws an error if there are not
   * enough canvases.
   * 
   * @returns {void}
   */
  public render(): void {
    const missing = this.missingCanvses;

    if (missing.length > 0) {
      throw new Error(`missing canvases for lines ${missing.join(', ')}`);
    }


  }

  /**
   * This is the step used to create all the artists, which are ultimately used to render to
   * the canvas. It will also assign all the Vexflow element to the wrapper model elements.
   * 
   * @returns {void}
   */
  private hydrate() {
    this.vextab.lines.forEach(line => {
      const artist = new Artist(10, 20, 980);
      this.artistsByLineId[line.id] = artist;
      const vextabGenerator = new VextabGenerator(artist);

      // Mimics the behavior of the original Vextab
      // See https://github.com/0xfe/vextab/blob/master/src/vextab.coffee#L204
      vextabGenerator.elements = [line.struct];
      vextabGenerator.generate();
      vextabGenerator.valid = true;
    });
  }
};

export default VextabRenderer;
