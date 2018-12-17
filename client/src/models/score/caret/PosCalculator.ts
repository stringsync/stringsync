import { ISpec } from '../../maestro/Maestro';
import { get, first } from 'lodash';
import { Score } from '../Score';
import { interpolate } from '../../../utils/interpolate';
import { Line } from '../line/Line';

export class PosCalculator {
  public static BBOX_OFFSET = 10; // px

  public readonly score: Score;
  public readonly spec: ISpec;
  public readonly tick: number;

  constructor(score: Score, spec: ISpec, tick: number) {
    this.score = score;
    this.spec = spec;
    this.tick = tick;
  }

  public get x(): number {
    const { startTick, stopTick, note } = this.spec;

    // x0 calc
    let x0: number = 0;
    if (note) {
      x0 = this.getX(note.graphic);
    } else {
      throw new Error('cannot calculate x from null note');
    }

    // x1 calc
    let x1: number = 0;
    if (note && note.next) {
      const noteLine = get(note, 'measure.line');
      const nextNoteLine = get(note.next, 'measure.line');

      if (!noteLine || !nextNoteLine) {
        throw new Error(`expected note's measure to be hydrated`);
      }

      if (noteLine === nextNoteLine) {
        x1 = this.getX(note.next.graphic);
      } else {
        x1 = this.svgWidth;
      }
    } else {
      throw new Error('cannot calculate x from null note.next');
    }

    return interpolate({ x: startTick, y: x0 }, { x: stopTick, y: x1 }, this.tick);
  }

  public get y(): number {
    let line;
    if (this.spec.note) {
      line = get(this.spec.note, 'measure.line');
    } else {
      // if you have no start note, you are at the beginning, so use the first line
      line = first(this.score.lines);
    }

    if (!line) {
      throw new Error('could not find line for y computation');
    }

    return line.graphic.getBBox().y - 25;
  }

  private get svgWidth(): number {
    return this.score.svg.getBBox().width;
  }

  private getX(graphic: any): number {
    const bbox = graphic.getBBox();
    return bbox.x + bbox.width;
  }
}
