import { VextabRenderer } from './VextabRenderer';
import { RendererStore } from './RendererStore';
import { isEqual, get } from 'lodash';
import { Maestro } from 'services/maestro/Maestro';
import { interpolate } from 'utilities';
import { Line } from 'models/music';

interface ICaretRendererStoreData {
  line: Line;
  canvas?: HTMLCanvasElement;
}

export class CaretRenderer {
  public static THICKNESS = 2; // px
  public static ALPHA = 0.75;
  public static STROKE_STYLE = '#fc354c';
  public static CARET_HEIGHT = 227; // px

  public readonly store: RendererStore<ICaretRendererStoreData> = new RendererStore<ICaretRendererStoreData>();
  public readonly vextabRenderer: VextabRenderer;

  public renderedLines: Line[] = [];

  constructor(vextabRenderer: VextabRenderer) {
    this.vextabRenderer = vextabRenderer;
  }

  public get lines(): Line[] {
    return this.vextabRenderer.vextab.lines;
  }

  public get isRenderable(): boolean {
    const lineIds = this.lines.map(line => line.id).sort();
    const canvasLineIds = Object.keys(this.store.data).map(lineId => parseInt(lineId, 10)).sort();
    return isEqual(lineIds, canvasLineIds);
  }

  public get width(): number {
    return this.vextabRenderer.width;
  }

  public get height(): number {
    return this.vextabRenderer.height;
  }

  public assign(line: Line, canvas: HTMLCanvasElement): void {
    this.store.assign(line, 'canvas', canvas);
    this.resize(line);
    this.setStyles(line);
  }

  public render(maestro: Maestro): void {
    this.clear();

    const x = this.getXForRender(maestro);

    if (typeof x === 'number') {
      const line: Line | void = get(maestro.state.note, 'measure.line');
      if (line) {

        let canvas: HTMLCanvasElement | void;
        try {
          canvas  = this.store.fetch(line).canvas;
        } catch (error) {
          // noop
        }

        if (!canvas) {
          return;
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return;
        }

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 0 + CaretRenderer.CARET_HEIGHT);
        ctx.stroke();
        ctx.closePath();

        this.renderedLines.push(line);
      }
    }
  }

  public clear(): void {
    this.renderedLines.forEach(line => {
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

    this.renderedLines = [];
  }

  /**
   * Used exclusively in CaretRenderer.prototype.render
   * 
   * @param maestro 
   */
  private getXForRender(maestro: Maestro): number | void {
    const { vextab } = maestro;
    const { time, note, start, stop } = maestro.state;

    if (!vextab || !time || !note || typeof start !== 'number' || typeof stop !== 'number') {
      // nothing to render
      return;
    }

    if (!note.isHydrated) {
      throw new Error('Must hydrate the measure element before rendering the Caret for it');
    }

    const curr = note;
    const next = vextab.links.next(note, true) as typeof note;

    // interpolation args
    const t0 = start;
    const t1 = stop;
    const x0 = curr.vexAttrs!.staveNote.getAbsoluteX();
    let x1;
    if (!next) {
      // currently on last note
      x1 = this.width;
    } else if (curr.measure && curr.measure.line !== get(next, 'measure.line')) {
      // next note is on a different line
      x1 = this.width;
    } else {
      // most frequent case: note is on the same line
      x1 = next.vexAttrs!.staveNote.getAbsoluteX();
    }

    // interpolate
    return interpolate({ x: t0, y: x0 }, { x: t1, y: x1 }, time.tick);
  }

  private resize(line: Line): void {
    const { width, height } = this;
    const ratio = window.devicePixelRatio || 1;

    const { canvas } = this.store.fetch(line);

    if (!canvas) {
      throw new Error(`could not resize line ${line.id}: missing canvas`);
    }

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width * ratio}px`;
    canvas.style.height = `${height * ratio}px`;
  }

  private setStyles(line: Line): void {
    const { canvas } = this.store.fetch(line);

    if (!canvas) {
      throw new Error(`could not set style for line ${line.id}: missing canvas`);
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error(`no context found for ${line.id}`);
    }

    ctx.strokeStyle = CaretRenderer.STROKE_STYLE;
    ctx.lineWidth = CaretRenderer.THICKNESS;
    ctx.globalAlpha = CaretRenderer.ALPHA;
  }
}
