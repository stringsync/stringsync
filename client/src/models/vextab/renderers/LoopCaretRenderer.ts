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

  // TODO: Clean up this function.
  public render(maestro: Maestro): void {
    this.clear();
    const { vextab } = maestro;

    if (!vextab) {
      return;
    }

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

    // fill to the right, unless firstLine === lastLine
    const firstLine = specs[0].line;

    // fill to the left, unless firstLine === lastLine
    const lastLine = specs[1].line;

    // fill entire lines
    const inBetweenLines: Line[] = [];

    if (firstLine !== lastLine) {
      let probeLine = vextab.links.next(firstLine) as Line | void;
      while (probeLine && probeLine !== lastLine) {
        inBetweenLines.push(probeLine);
        probeLine = vextab.links.next(probeLine) as Line | void;
      }
    }

    // There are only two cases we need to handle:
    //   The firstLine and lastLine are the same line. Only fill in between the carets.
    //   The firstLine and lastLines are different. Fill the first line all the way to the right,
    //   the inBewteenLines completely, and the lastLine all the way to the left.
    if (firstLine === lastLine) {
      const { canvas } = this.store.fetch(firstLine);

      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, LoopCaretRenderer.CARET_HEIGHT);
      ctx.rect(specs[0].x, 0, specs[1].x - specs[0].x, LoopCaretRenderer.CARET_HEIGHT);
      ctx.fill();
    } else {
      // firstLine
      let canvas = this.store.fetch(firstLine).canvas;

      if (!canvas) {
        return;
      }

      let ctx = canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, LoopCaretRenderer.CARET_HEIGHT);
      ctx.rect(specs[0].x, 0, canvas.width, LoopCaretRenderer.CARET_HEIGHT);
      ctx.fill();

      // inBetweenLines
      inBetweenLines.forEach(line => {
        const lineCanvas = this.store.fetch(line).canvas;

        if (!lineCanvas) {
          return;
        }

        const lineCtx = lineCanvas.getContext('2d');

        if (!lineCtx) {
          return;
        }

        lineCtx.clearRect(0, 0, lineCanvas.width, LoopCaretRenderer.CARET_HEIGHT);
        lineCtx.rect(0, 0, lineCanvas.width, LoopCaretRenderer.CARET_HEIGHT);
        lineCtx.fill();
      });

      // lastLine
      canvas = this.store.fetch(lastLine).canvas;

      if (!canvas) {
        return;
      }

      ctx = canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, LoopCaretRenderer.CARET_HEIGHT);
      ctx.rect(0, 0, specs[1].x, LoopCaretRenderer.CARET_HEIGHT);
      ctx.fill();
    }
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
    const { vextab, tickMap } = maestro;
    const { loopStart, loopEnd } = maestro.state;

    if (!vextab || !loopStart || !loopEnd || !tickMap) {
      // nothing to render
      return;
    }

    try {
      return [loopStart, loopEnd].map(time => {
        const { note, start, stop } = tickMap.fetch(time.tick);
  
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
    } catch (error) {
      // most likely a fetch error
      return;
    }
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
