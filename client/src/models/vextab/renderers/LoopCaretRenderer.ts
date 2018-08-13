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

interface IRenderSpec {
  x: number;
  line: Line;
}

export class LoopCaretRenderer {
  public static THICKNESS = 2; // px
  public static ALPHA = 0.75;
  public static STROKE_STYLE = '#4286f4';
  public static CARET_HEIGHT = 227; // px

  public readonly store: RendererStore<ICaretRendererStoreData> = new RendererStore<ICaretRendererStoreData>();
  public readonly vextabRenderer: VextabRenderer;

  public rendereredLines: Line[] = [];

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

    const specs = this.renderSpec(maestro);

    if (!specs) {
      return;
    }

    specs.forEach(spec => {
      const line = spec.line;
      if (line) {
        const { canvas } = this.store.fetch(line);

        if (!canvas) {
          return;
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return;
        }

        ctx.beginPath();
        ctx.moveTo(spec.x, 0);
        ctx.lineTo(spec.x, 0 + LoopCaretRenderer.CARET_HEIGHT);
        ctx.stroke();
        ctx.closePath();

        this.rendereredLines.push(line);
      }
    });
  }

  public clear(): void {
    this.rendereredLines.forEach(line => {
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

    this.rendereredLines = [];
  }

  /**
   * Used exclusively in LoopCaretRenderer.prototype.render
   * 
   * @param maestro 
   */
  private renderSpec(maestro: Maestro): [IRenderSpec, IRenderSpec] | void {
    const { vextab } = maestro;
    const { loopStart, loopEnd } = maestro.state;

    if (!vextab || !loopStart || !loopEnd || !maestro.tickMap) {
      // nothing to render
      return;
    }

    return [loopStart, loopEnd].map(time => {
      const { note, start, stop } = maestro.tickMap!.fetch(time.tick);

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
      const x = interpolate({ x: t0, y: x0 }, { x: t1, y: x1 }, time.tick);

      const line = get(note.measure, 'line');
      return { x, line }
    }) as [IRenderSpec, IRenderSpec]
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

    ctx.strokeStyle = LoopCaretRenderer.STROKE_STYLE;
    ctx.lineWidth = LoopCaretRenderer.THICKNESS;
    ctx.globalAlpha = LoopCaretRenderer.ALPHA;
  }
}
