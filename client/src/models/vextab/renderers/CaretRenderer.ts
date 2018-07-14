import { VextabRenderer } from './VextabRenderer';
import { RendererStore } from './RendererStore';
import { Line } from 'models/music';
import { isEqual } from 'lodash';
import { Maestro } from '../../../services/maestro/Maestro';

interface ICaretRendererStoreData {
  line: Line;
  canvas?: HTMLCanvasElement;
}

export class CaretRenderer {
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
    
    const { line, time, note, measure } = maestro.state;

    if (!line || !time || !note || !measure) {
      return;
    }

    

    this.rendereredLines.push(line);
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
}
