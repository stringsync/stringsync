import { Flow } from 'vexflow';
import { Vextab } from 'models/vextab';
import { Artist } from 'vextab/releases/vextab-div.js';
import { VextabHydrator } from './VextabHydrator';
import { VextabRenderValidator } from './VextabRenderValidator';
import { isEqual } from 'lodash';

Artist.NO_LOGO = true;

/**
 * This class is a wrapper around Vexflow's renderer that allows the caller to assign
 * canvases for each Vextab line, and render each line.
 * 
 * In the context of this class, a Vextab line is hydrated when a Vextab Artist is assigned
 * to that particular lineId via artistsByLineId. See VextabRenderer.prototype.isRenderable.
 */
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
  public isRendered: boolean = false;

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
    if (width === this.$width) {
      return;
    }

    this.$width = width;

    if (this.isRenderable && this.isRendered) {
      this.rehydrate();
      this.clear();
      this.render();
    }
  }

  public get height(): number {
    return this.$height;
  }

  public set height(height: number) {
    if (height === this.$height) {
      return;
    }

    this.$height = height;
  
    if (this.isRenderable && this.isRendered) {
      this.rehydrate();
      this.clear();
      this.render();
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
    this.backendRenderersByLineId[lineId] = new Flow.Renderer(canvas, Flow.Renderer.Backends.CANVAS);
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
      this.isRendered = true;
    } else {
      throw validator.errors;
    }
  }

  public clear(): void {
    this.forEachLineId(lineId => {
      const canvas = this.canvasesByLineId[lineId];
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    this.isRendered = false;
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

    const artist = new Artist(10, 20, this.width);
    this.artistsByLineId[line.id] = artist;

    VextabHydrator.hydrate(line, artist);
  }

  private rehydrate(): void {
    Object.keys(this.canvasesByLineId).forEach(id => {
      const canvas = this.canvasesByLineId[id];
      this.assign(canvas, parseInt(id, 10));
    });
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
