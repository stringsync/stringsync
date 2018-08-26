import { Flow } from 'vexflow';
import { Vextab } from '..';
import { Artist } from 'vextab/releases/vextab-div.js';
import { VextabHydrator } from './VextabHydrator';
import { RendererValidator } from './RendererValidator';
import { get, isEqual } from 'lodash';
import { Bar, Line } from 'models/music';
import { RendererStore } from './RendererStore';
import { CaretRenderer } from './CaretRenderer';
import { LoopCaretRenderer } from './LoopCaretRenderer';
import { SelectorRenderer } from './SelectorRenderer';

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
  public readonly caretRenderer: CaretRenderer;
  public readonly loopCaretRenderer: LoopCaretRenderer;
  public readonly selectorRenderer: SelectorRenderer;
  public readonly height: number = VextabRenderer.DEFAULT_LINE_HEIGHT;
  public readonly width: number = VextabRenderer.DEFAULT_LINE_WIDTH;

  public isRendered: boolean = false;

  constructor(vextab: Vextab, width: number | void) {
    this.vextab = vextab;

    if (width) {
      this.width = width;
    }
    
    this.store = new RendererStore();

    // sub-renderers
    this.caretRenderer = new CaretRenderer(this);
    this.loopCaretRenderer = new LoopCaretRenderer(this);
    this.selectorRenderer = new SelectorRenderer(this);
  }

  public get isRenderable(): boolean {
    const lineIds = this.vextab.lines.map(line => line.index).sort();
    const hydratedLineIds = Object.keys(this.store.data).map(lineId => parseInt(lineId, 10)).sort();
    return isEqual(lineIds, hydratedLineIds);
  }

  /**
   * The interface to populate canvasesByLineId. It will automatically 
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {number} lineNumber 
   * @returns {void}
   */
  public assign(line: Line, canvas: HTMLCanvasElement): void {
    this.store.assign(line, 'canvas', canvas);

    const vexRenderer = new Flow.Renderer(canvas, Flow.Renderer.Backends.CANVAS);
    this.store.assign(line, 'vexRenderer', vexRenderer)

    this.hydrate(line.index);
  }

  /**
   * First, validates to ensure that all lines have a canvas. Throws an error if there are not
   * enough canvases.
   * 
   * @returns {void}
   */
  public render(): void {
    this.resize();
    this.clear();

    const validator = new RendererValidator(this);

    if (validator.validate()) {
      this.doRender();
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
   * the canvas.
   * 
   * This function will take the artist that is instantiated and extract the directives from it
   * via the DirectiveExtractor. Caller beware: The extraction process involves mutating the
   * artist in place. It will also assign all the Vexflow element to the wrapper model elements via
   * the VextabHydrator.
   *
   * @returns {void}
   */
  private hydrate(lineId: number): void {
    const line = this.vextab.lines.find(vextabLine => vextabLine.index === lineId);

    if (typeof line === 'undefined') {
      throw new Error(`could not find line ${lineId}`);
    }

    const artist = new Artist(5, 20, this.width);
    this.store.assign(line, 'artist', artist);

    VextabHydrator.hydrate(line, artist);
  }

  /**
   * Performs the render.
   */
  private doRender(): void {
    try {
      this.vextab.lines.forEach(line => {
        const { artist, vexRenderer, canvas } = this.store.fetch(line);

        if (!artist || !vexRenderer || !canvas) {
          throw new Error(`could not render line ${line.index}`);
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error(`no context found for ${line.index}`);
        }

        // render score
        artist.render(vexRenderer);

        // render measure numbers
        ctx.save();
        ctx.fillStyle = 'darkgray';
        ctx.font = 'italic 10px arial';

        line.measures.forEach(measure => {
          const bar = measure.elements.find(el => el instanceof Bar);
          const vexAttrs = get(bar, 'vexAttrs');

          if (!vexAttrs) {
            return;
          }

          const barNote = vexAttrs.staveNote as Vex.Flow.BarNote;
          const x = barNote.getAbsoluteX();

          ctx.fillText(measure.index.toString(), x - 3, 50);
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
        throw new Error(`could not resize line ${line.index}: missing canvas`);
      }

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width * ratio}px`;
      canvas.style.height = `${height * ratio}px`;
    })
  }
}
