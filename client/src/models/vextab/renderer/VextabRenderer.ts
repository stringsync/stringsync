import { Flow } from 'vexflow';
import { Vextab } from '..';
import { Artist } from 'vextab/releases/vextab-div.js';
import { VextabHydrator } from './VextabHydrator';
import { VextabRenderValidator } from './VextabRenderValidator';
import { isEqual, sortBy } from 'lodash';
import { Bar } from '../../music';
import { RendererStore, IStoreData } from './RendererStore';
import { Line } from '../..';
import { CaretRenderer } from './sub-renderers/CaretRenderer';
import { LoopCaretRenderer } from './sub-renderers/LoopCaretRenderer';
import { ScoreRenderer } from './sub-renderers/ScoreRenderer';

Artist.NOLOGO = true;

/**
 * This class is a wrapper around Vexflow's renderer that allows the caller to assign
 * canvases for each Vextab line, and render each line.
 * 
 * In the context of this class, a Vextab line is hydrated when a Vextab Artist is assigned
 * to that particular lineId via artistsByLineId. See VextabRenderer.prototype.isRenderable.
 */
export class VextabRenderer {
  public static DEFAULT_LINE_HEIGHT = 280;
  public static DEFAULT_LINE_WIDTH = 640;

  public readonly vextab: Vextab;
  public readonly store: RendererStore = new RendererStore();
  public isRendered: boolean = false;

  private $height: number = VextabRenderer.DEFAULT_LINE_HEIGHT;
  private $width: number = VextabRenderer.DEFAULT_LINE_WIDTH;
  private caretRenderer: CaretRenderer;
  private loopCaretRenderer: LoopCaretRenderer;
  private scoreRenderer: ScoreRenderer;

  constructor(vextab: Vextab) {
    this.vextab = vextab;
  }

  public get isRenderable(): boolean {
    const lineIds = this.vextab.lines.map(line => line.id);
    const hydratedLineIds = Object.keys(this.store.data).map(lineId => parseInt(lineId, 10));
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
  public assign(line: Line, key: keyof IStoreData, data: any): void {
    this.store.assign(line, key, data);

    if (key === 'scoreCanvas') {
      const renderer = new Flow.Renderer(data, Flow.Renderer.Backends.CANVAS);
      this.store.assign(line, 'renderer', renderer)

      this.hydrate(line.id);
    }
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
        const canvas = this.store.fetch(line).scoreCanvas;

        if (!canvas) {
          return;
        }

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
    this.assign(line, 'artist', artist);

    VextabHydrator.hydrate(line, artist);
  }

  private rehydrate(): void {
    this.vextab.lines.forEach(line => {
      const canvas = this.store.fetch(line).scoreCanvas;

      if (!canvas) {
        return;
      }

      this.assign(line, 'scoreCanvas', canvas);
    });
  }

  /**
   * Performs the render.
   */
  private doRender(): void {
    this.resize();

    try {
      this.vextab.lines.forEach(line => {
        const { artist, renderer, scoreCanvas } = this.store.fetch(line);

        if (!artist || !renderer || !scoreCanvas) {
          throw new Error(`could not render line ${line.id}`);
        }

        const ctx = scoreCanvas.getContext('2d');

        if (!ctx) {
          throw new Error(`no context found for ${line.id}`);
        }

        // render score
        artist.render(renderer);

        // render measure numbers
        ctx.save();
        ctx.fillStyle = 'darkgray';
        ctx.font = 'italic 10px arial';

        line.measures.forEach(measure => {
          const bar = measure.elements.find(el => el.type === 'BAR') as Bar;

          if (!bar.vexAttrs) {
            return;
          }

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
      const canvas = this.store.fetch(line).scoreCanvas;

      if (!canvas) {
        throw new Error(`could not resize line ${line.id}: missing canvas`);
      }

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width * ratio}px`;
      canvas.style.height = `${height * ratio}px`;
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
