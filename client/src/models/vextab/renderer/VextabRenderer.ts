import { Flow } from 'vexflow';
import { Vextab } from 'models/vextab';
import { Artist } from 'vextab/releases/vextab-div.js';
import { VextabHydrator } from './VextabHydrator';
import { VextabRenderValidator } from './VextabRenderValidator';
import { debounce, isEqual } from 'lodash';

Artist.NO_LOGO = true;

const CANVAS_BACKEND = Flow.Renderer.Backends.CANVAS;

// This function is debounced since it is a heavy operation
const rehydrate = debounce((renderer: VextabRenderer): void => {
  Object.keys(renderer.canvasesByLineId).forEach(id => {
    const canvas = renderer.canvasesByLineId[id];
    renderer.assign(canvas, parseInt(id, 10));
  });
}, 500);

export class VextabRenderer {
  public static get DEFAULT_LINE_HEIGHT(): number {
    return 280;
  }

  public static get DEFAULT_LINE_WIDTH(): number {
    return 640;
  }

  public readonly vextab: Vextab;
  public canvasesByLineId: { [lineId: string]: HTMLCanvasElement } = {};
  public artistsByLineId: { [lineId: string]: any } = {};
  public backendRenderersByLineId: { [lineId: string]: Flow.Renderer } = {};

  private $height: number = VextabRenderer.DEFAULT_LINE_HEIGHT;
  private $width: number = VextabRenderer.DEFAULT_LINE_WIDTH;

  constructor(vextab: Vextab) {
    this.vextab = vextab;
  }

  public get isRenderable(): boolean {
    const lineIds = this.vextab.lines.map(line => line.id);
    const hydratedLineIds = Object.keys(this.artistsByLineId).map(lineId => parseInt(lineId, 10));
    return isEqual(lineIds, hydratedLineIds);
  }

  public get width(): number {
    return this.$width;
  }

  public set width(width: number) {
    this.$width = width;

    if (this.isRenderable) {
      rehydrate(this);
    }
  }

  public get height(): number {
    return this.$height;
  }

  public set height(height: number) {
    this.$height = height;
  
    if (this.isRenderable) {
      rehydrate(this);
    }
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
    this.backendRenderersByLineId[lineId] = new Flow.Renderer(canvas, CANVAS_BACKEND);
    this.hydrate(lineId);
  }

  /**
   * First, validates to ensure that all lines have a canvas. Throws an error if there are not
   * enough canvases.
   * 
   * @returns {void}
   */
  public render(): void {
    const validator = new VextabRenderValidator(this);

    if (validator.validate()) {
      this.doRender();
    } else {
      throw validator.errors;
    }
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
    } else if (typeof this.width === 'undefined') {
      throw new Error('expected width to be defined');
    }

    const artist = new Artist(10, 20, this.width);
    this.artistsByLineId[line.id] = artist;

    VextabHydrator.hydrate(line, artist);
  }

  private doRender(): void {
    this.resize();

    this.forEachLineId(lineId => {
      const artist = this.artistsByLineId[lineId];
      const backendRenderer = this.backendRenderersByLineId[lineId];

      artist.render(backendRenderer);
    })
  }

  private resize(): void {
    const { width, height } = this;
    const ratio = window.devicePixelRatio || 1;

    this.forEachLineId(lineId => {
      const canvas = this.canvasesByLineId[lineId];

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    })
  }

  private forEachLineId(callback: (lineId: number) => void) {
    this.vextab.lines.map(line => line.id).forEach(lineId => {
      callback(lineId)
    });
  }
};

export default VextabRenderer;
