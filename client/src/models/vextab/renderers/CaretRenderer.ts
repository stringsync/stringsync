import { VextabRenderer } from './VextabRenderer';
import { RendererStore } from './RendererStore';
import { Line } from '../../music';
import { isEqual, get, last } from 'lodash';
import { Maestro } from 'services/maestro/Maestro';
import { interpolate } from 'utilities';

interface ICaretRendererStoreData {
  line: Line;
  canvas?: HTMLCanvasElement;
}

export class CaretRenderer {
  public static THICKNESS = 2; // px
  public static ALPHA = 0.75;
  public static STROKE_STYLE = '#fc354c';

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

  public render(maestro: Maestro): void {
    this.clear();
    this.resize();
    this.setStyles();

    const x = this.getXForRender(maestro);

    if (typeof x === 'number') {
      const line: Line | void = get(maestro.state.note, 'measure.line');
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
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 0 + this.vextabRenderer.height);
        ctx.stroke();
        ctx.closePath();

        this.rendereredLines.push(line);
      }
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
   * Used exclusively in CaretRenderer.prototype.render
   * 
   * @param maestro 
   */
  private getXForRender(maestro: Maestro): number | void {
    const { vextab } = maestro;
    const { time, note } = maestro.state;

    if (!vextab || !time || !note) {
      // nothing to render
      return;
    }

    if (!note.isHydrated) {
      throw new Error('Must hydrate the measure element before rendering the Caret for it');
    }

    const curr = note;
    const next = vextab.links.next(note, true) as typeof note;

    // interpolation args
    const currStaveNote = curr.vexAttrs!.staveNote;
    const x0 = currStaveNote.getAbsoluteX();
    const t0 = currStaveNote.getTicks().quotient();
    let x1;
    let t1;

    if (!next) {
      // currently on last note
      // use the vextab renderer's width
      x1 = vextab.renderer.width;
      t1 = last(maestro.tickMap!.data)!.stop;
    } else if (curr.measure && curr.measure.line === get(next, 'measure.line')) {
      // next note is on a different line
      // use the vextab renderer's width
      x1 = vextab.renderer.width;
      t1 = next.vexAttrs!.staveNote.getTicks().quotient();
    } else {
      // most frequent case: note is on the same line
      x1 = next.vexAttrs!.staveNote.getAbsoluteX();
      t1 = next.vexAttrs!.staveNote.getTicks().quotient();
    }

    // interpolate
    return interpolate({ x: t0, y: x0 }, { x: t1, y: x1 }, time.tick);
  }

  private resize(): void {
    const { width, height } = this;
    const ratio = window.devicePixelRatio || 1;

    this.lines.forEach(line => {
      const { canvas } = this.store.fetch(line);

      if (!canvas) {
        throw new Error(`could not resize line ${line.id}: missing canvas`);
      }

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width * ratio}px`;
      canvas.style.height = `${height * ratio}px`;
    });
  }

  private setStyles(): void {
    const ratio = window.devicePixelRatio || 1;

    this.lines.forEach(line => {
      const { canvas } = this.store.fetch(line);

      if (!canvas) {
        throw new Error(`could not set style for line ${line.id}: missing canvas`);
      }

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error(`no context found for ${line.id}`);
      }

      ctx.scale(ratio, ratio);
      ctx.strokeStyle = CaretRenderer.STROKE_STYLE;
      ctx.lineWidth = CaretRenderer.THICKNESS;
      ctx.globalAlpha = CaretRenderer.ALPHA;
    });
  }
}
