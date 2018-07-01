import { Flow } from 'vexflow';
import { Vextab } from 'models/vextab';
import { Artist } from 'vextab/releases/vextab-div.js';
import { VextabHydrator } from './VextabHydrator';

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

  /**
   * The interface to populate canvasesByLineId. It will automatically 
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {number} lineNumber 
   * @returns {void}
   */
  public assign(canvas: HTMLCanvasElement, lineId: number): void {
    this.canvasesByLineId[lineId] = canvas;
    this.hydrate(lineId);
  }

  /**
   * First, validates to ensure that all lines have a canvas. Throws an error if there are not
   * enough canvases.
   * 
   * @returns {void}
   */
  public render(): void {
    const missingCanvases = this.missingCanvases;
    const missingArtists = this.missingArtists;

    if (missingCanvases.length > 0) {
      throw new Error(`missing canvases for lines ${missingCanvases.join(', ')}`);
    } else if (missingArtists.length > 0) {
      throw new Error(`missing artists for lines ${missingArtists.join(', ')}`);
    }


  }

  private get missingCanvases(): number[] {
    return this.vextab.lines.map(line => line.id).filter(id => !this.canvasesByLineId[id]);
  }

  private get missingArtists(): number[] {
    return this.vextab.lines.map(line => line.id).filter(id => !this.artistsByLineId[id]);
  }

  /**
   * This is the step used to create all the artists, which are ultimately used to render to
   * the canvas. It will also assign all the Vexflow element to the wrapper model elements.
   * 
   * @returns {void}
   */
  private hydrate(lineId: number): void {
    const line = this.vextab.lines.find(vextabLine => vextabLine.id === lineId);

    if (typeof line === 'undefined') {
      throw new Error(`could not find line ${lineId}`);
    }

    const artist = new Artist(10, 20, 980);
    this.artistsByLineId[line.id] = artist;

    VextabHydrator.hydrate(line, artist);
  }
};

export default VextabRenderer;
