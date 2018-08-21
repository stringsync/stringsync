import { Line } from 'models/music';
import { VextabRenderer } from './VextabRenderer';
import { RendererStore } from './RendererStore';
import { isEqual, get } from 'lodash';
import { Maestro } from 'services';

interface IStoreData {
  line: Line;
  canvas: HTMLCanvasElement;
}

export class SelectorRenderer {
  public static FILL_STYLE = '#1034A6';

  public readonly store: RendererStore<IStoreData> = new RendererStore<IStoreData>();
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

  public render(maestro: Maestro): void {
    this.clear();

    const x = this.getXForRender(maestro);

    if (typeof x === 'number') {
      const line: Line | void = get(maestro.state.note, 'measure.line');
      if (line) {

        let canvas: HTMLCanvasElement | void;
        try {
          canvas = this.store.fetch(line).canvas;
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
        ctx.arc(x + 6, 40, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        this.renderedLines.push(line);
      }
    }
  }

  private getXForRender(maestro: Maestro): number | void {
    const { note } = maestro.state;

    if (!note || !note.isHydrated) {
      return;
    }

    return note.vexAttrs!.staveNote.getAbsoluteX();
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

    ctx.fillStyle = SelectorRenderer.FILL_STYLE;
  }
}