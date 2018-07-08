import { Flow } from 'vexflow';
import { Vextab } from 'models/vextab';
import { Artist } from 'vextab/releases/vextab-div.js';
import { VextabHydrator } from './VextabHydrator';
import { VextabRenderValidator } from './VextabRenderValidator';
import { isEqual, sortBy } from 'lodash';
import { Bar } from 'models/music';

Artist.NOLOGO = true;

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
    return isEqual(lineIds, hydratedLineIds) && !!this.width && !!this.height;
  }

  public get width(): number {
    return this.$width;
  }

  public set width(width: number) {
    this.setDimension('$width', width);
  }

  public get height(): number {
    return this.$height;
  }

  public set height(height: number) {
    this.setDimension('$height', height);
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
    } else {
      throw validator.errors;
    }
  }

  public clear(): void {
    try {
      this.vextab.lines.forEach(line => {
        const canvas = this.canvasesByLineId[line.id];
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error(`expected context for line ${line.id}`);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });

      this.isRendered = false;
    } catch (error) {
      console.error(error);
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
    }

    const artist = new Artist(6, 20, this.width);
    this.artistsByLineId[line.id] = artist;

    VextabHydrator.hydrate(line, artist);
  }

  private rehydrate(): void {
    Object.keys(this.canvasesByLineId).forEach(id => {
      const canvas = this.canvasesByLineId[id];
      this.assign(canvas, parseInt(id, 10));
    });
  }

  /**
   * Performs the render.
   */
  private doRender(): void {
    this.resize();

    try {
      this.vextab.lines.forEach(line => {
        const artist = this.artistsByLineId[line.id];
        const backendRenderer = this.backendRenderersByLineId[line.id];
        const ctx = this.canvasesByLineId[line.id].getContext('2d');

        if (!ctx) {
          throw new Error(`no context found for ${line.id}`);
        }

        // render score
        artist.render(backendRenderer);

        // render measure numbers
        ctx.save();
        ctx.fillStyle = 'darkgray';
        ctx.font = 'italic 10px arial';

        line.measures.forEach(measure => {
          const bar = measure.elements.find(el => el.type === 'BAR') as Bar;
          const barNote = bar.vexAttrs.staveNote as Vex.Flow.BarNote;
          const x = barNote.getAbsoluteX();

          ctx.fillText(measure.id.toString(), x - 3, 50);
        })

        ctx.restore();
      });

      this.isRendered = true;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Calls the canvas's setters, to resize it to this instance's width and height.
   */
  private resize(): void {
    const { width, height } = this;
    const ratio = window.devicePixelRatio || 1;

    this.vextab.lines.forEach(line => {
      const canvas = this.canvasesByLineId[line.id];

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    })
  }

  /**
   * Conditionally rerenders if this method is called and the renderer isRenderable and
   * isRendered. This is used in the height and width setters of this method.
   * 
   * @param field The field that should be set
   * @param value the value that got passed in
   */
  private setDimension(field: '$height' | '$width', value: number): void {
    if (value === this[field]) {
      return;
    }

    this[field] = value;

    if (this.isRenderable && this.isRendered) {
      this.rehydrate();
      this.clear();
      this.render();
    }
  }
};

export default VextabRenderer;
