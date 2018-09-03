import { Line } from '../../music';

interface IBaseData {
  line: Line;
  canvas?: HTMLCanvasElement;
}

/**
 * This class is used for managing rendering properties that belong to a line.
 */
export class RendererStore<T extends IBaseData> {
  public data: { [lineId: string]: (T | void) } = {};

  public fetch(line: Line | number | string): T | void {
    const lineId = typeof line === 'string' || typeof line === 'number' ? line : line.index;
    return this.data[lineId];
  }

  public assign(line: Line, key: keyof T, data: any): void {
    this.data[line.index] = this.data[line.index] || { line } as T;

    const mergeData = {} as T;
    mergeData[key] = data;

    this.data[line.index] = Object.assign({}, this.data[line.index], mergeData);
  }

  public unassign(line: Line): void {
    this.data[line.index] = undefined;
  }
}
