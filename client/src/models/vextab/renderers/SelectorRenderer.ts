import { Line } from 'models/music';
import { RendererStore } from './RendererStore';
import { isEqual, get } from 'lodash';
import { VextabElement, Vextab } from '../Vextab';

interface IStoreData {
  line: Line;
  canvas: HTMLCanvasElement;
}

export class SelectorRenderer { 
  public static FILL_STYLE = 'lime';

  public readonly store: RendererStore<IStoreData> = new RendererStore<IStoreData>();
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

  public render(element: VextabElement): void {
    this.clear();

    if (!element.isHydrated) {
      return;
    }

    const x = element.vexAttrs!.staveNote.getAbsoluteX();
    if (typeof x !== 'number') {
      return;
    }

    const line: Line | void = get(element, 'measure.line');
    if (!line) {
      return;
    }

    let canvas: HTMLCanvasElement;
    try {
      canvas = get(this.store.fetch(line), 'canvas');
    } catch (error) {
      return
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.beginPath();
    ctx.arc(x, 40, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    this.renderedLines.push(line);
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

    ctx.fillStyle = SelectorRenderer.FILL_STYLE;
  }
}