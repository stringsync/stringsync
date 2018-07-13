import { Line } from '../..';

export interface IStoreData {
  line: Line;
  scoreCanvas?: HTMLCanvasElement;
  caretCanvas?: HTMLCanvasElement;
  loopCanvas?: HTMLCanvasElement;
  artist?: any;
  renderer?: Vex.Flow.Renderer;
}

/**
 * This class is used for managing rendering properties that belong to a line.
 */
export class RendererStore {
  public data: { [lineId: string]: IStoreData | void } = {};

  public fetch(line: Line | number | string): IStoreData {
    let data;

    if (line instanceof Line) {
      data = this.data[line.id];
    } else {
      data = this.data[line];
    }

    if (!data) {
      throw new RangeError(`out of range: could not find data for line ${line}`);
    }

    return data;
  }

  public assign(line: Line, key: keyof IStoreData, data: any): void {
    this.data[line.id] = this.data[line.id] || { line };

    const mergeData = {};
    mergeData[key] = data;

    this.data[line.id] = Object.assign({}, this.data[line.id], mergeData);
  }

  public unassign(line: Line): void {
    this.data[line.id] = undefined;
  }
}
