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

  public fetch(line: Line | number | string): T {
    const lineId = typeof line === 'string' || typeof line === 'number' ? line : line.id;
    const data = this.data[lineId];

    if (!data) {
      throw new RangeError(`out of range: could not find data for line ${lineId}`);
    }

    return data;
  }

  public assign(line: Line, key: keyof T, data: any): void {
    this.data[line.id] = this.data[line.id] || { line } as T;

    const mergeData = {} as T;
    mergeData[key] = data;

    this.data[line.id] = Object.assign({}, this.data[line.id], mergeData);
  }

  public unassign(line: Line): void {
    this.data[line.id] = undefined;
  }
}
