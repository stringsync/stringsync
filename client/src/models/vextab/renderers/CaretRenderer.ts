import { VextabRenderer } from './VextabRenderer';
import { RendererStore } from './RendererStore';
import { isEqual, get } from 'lodash';
import { Maestro } from 'services/maestro/Maestro';
import { Line } from 'models/music';
import { VextabElement, Vextab } from '../Vextab';

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
  public readonly vextab: Vextab;

  public renderedLines: Line[] = [];

  constructor(vextab: Vextab) {
    this.vextab = vextab;
  }

  public get lines(): Line[] {
    return this.vextab.lines;
  }

  public get isRenderable(): boolean {
    const lineIds = this.lines.map(line => line.index).sort();
    const canvasLineIds = Object.keys(this.store.data).map(lineId => parseInt(lineId, 10)).sort();
    return isEqual(lineIds, canvasLineIds);
  }

  public get width(): number {
    return this.vextab.width;
  }

  public get height(): number {
    return this.vextab.scoreRenderer.height;
  }

  public assign(line: Line, canvas: HTMLCanvasElement): void {
    this.store.assign(line, 'canvas', canvas);
    this.resize(line);
    this.setStyles(line);
  }

  public render(x: number, line: Line): void {
    this.clear();

    const canvas = get(this.store.fetch(line), 'canvas');

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

  public clear(): void {
    this.renderedLines.forEach(line => {
      const canvas = get(this.store.fetch(line), 'canvas');

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

  private resize(line: Line): void {
    const { width, height } = this;
    const ratio = window.devicePixelRatio || 1;

    const canvas = get(this.store.fetch(line), 'canvas');

    if (!canvas) {
      throw new Error(`could not resize line ${line.index}: missing canvas`);
    }

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width * ratio}px`;
    canvas.style.height = `${height * ratio}px`;
  }

  private setStyles(line: Line): void {
    const canvas = get(this.store.fetch(line), 'canvas');

    if (!canvas) {
      throw new Error(`could not set style for line ${line.index}: missing canvas`);
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error(`no context found for ${line.index}`);
    }

    ctx.strokeStyle = CaretRenderer.STROKE_STYLE;
    ctx.lineWidth = CaretRenderer.THICKNESS;
    ctx.globalAlpha = CaretRenderer.ALPHA;
  }
}
