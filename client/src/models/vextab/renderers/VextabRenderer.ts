import { Flow } from 'vexflow';
import { Vextab } from '..';
import { Artist } from 'vextab/releases/vextab-div.js';
import { VextabHydrator } from './VextabHydrator';
import { RendererValidator } from './RendererValidator';
import { isEqual } from 'lodash';
import { Bar, Line } from 'models/music';
import { RendererStore } from './RendererStore';
import { CaretRenderer } from './CaretRenderer';
import { LoopCaretRenderer } from './LoopCaretRenderer';

Artist.NOLOGO = true;

interface IVextabRendererStoreData {
  line: Line;
  canvas?: HTMLCanvasElement;
  artist?: any;
  vexRenderer?: Vex.Flow.Renderer;
}

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
  public readonly store: RendererStore<IVextabRendererStoreData>;

  public isRendered: boolean = false;

  private $height: number = VextabRenderer.DEFAULT_LINE_HEIGHT;
  private $width: number = VextabRenderer.DEFAULT_LINE_WIDTH;

  private caretRenderer: CaretRenderer;
  private loopCaretRenderer: LoopCaretRenderer;

  constructor(vextab: Vextab) {
    this.vextab = vextab;

    this.store = new RendererStore();
    this.caretRenderer = new CaretRenderer(this);
    this.loopCaretRenderer = new LoopCaretRenderer(this);
  }

  public get isRenderable(): boolean {
    const lineIds = this.vextab.lines.map(line => line.id).sort();
    const hydratedLineIds = Object.keys(this.store.data).map(lineId => parseInt(lineId, 10)).sort();
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
  public assign(line: Line, canvas: HTMLCanvasElement, key: 'score' | 'caret' | 'loopCaret'): void {
    switch (key) {
      case 'score':
        this.store.assign(line, 'canvas', canvas);

        const vexRenderer = new Flow.Renderer(canvas, Flow.Renderer.Backends.CANVAS);
        this.store.assign(line, 'vexRenderer', vexRenderer)

        this.hydrate(line.id);
        break;
      case 'caret':
        this.caretRenderer.store.assign(line, 'canvas', canvas);
        break;
      case 'loopCaret':
        break;
      default:
        break;
    }
  }

  /**
   * First, validates to ensure that all lines have a canvas. Throws an error if there are not
   * enough canvases.
   * 
   * @returns {void}
   */
  public render(lines: Line[] = this.vextab.lines): void {
    this.clear();
    this.resize();

    const validator = new RendererValidator(this);

    if (validator.validate()) {
      this.doRender(lines);
    } else {
      throw validator.errors;
    }
  }

  public clear(): void {
    try {
      this.vextab.lines.forEach(line => {
        const { canvas } = this.store.fetch(line);

        if (!canvas) {
          return;
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return;
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
    this.store.assign(line, 'artist', artist);

    VextabHydrator.hydrate(line, artist);
  }

  private rehydrate(): void {
    this.vextab.lines.forEach(line => {
      const { canvas } = this.store.fetch(line);

      if (!canvas) {
        return;
      }

      this.store.assign(line, 'canvas', canvas);
    });
  }

  /**
   * Performs the render.
   */
  private doRender(lines: Line[]): void {
    try {
      lines.forEach(line => {
        const { artist, vexRenderer, canvas } = this.store.fetch(line);

        if (!artist || !vexRenderer || !canvas) {
          throw new Error(`could not render line ${line.id}`);
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error(`no context found for ${line.id}`);
        }

        // render score
        artist.render(vexRenderer);

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
      const { canvas } = this.store.fetch(line);

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
