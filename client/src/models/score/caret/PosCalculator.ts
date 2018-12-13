import { ISpec } from '../../maestro/Maestro';
import { get, first } from 'lodash';
import { Score } from '../Score';
import { interpolate } from '../../../utils/interpolate';

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
    // Compute t0 and t1
    const t0 = this.spec.start.tick;
    const t1 = this.spec.stop.tick;

    let startNote = this.spec.start.note;
    const stopNote = this.spec.stop.note;

    // Compute x0
    let x0: number;
    if (startNote) {
      x0 = this.getX(startNote.graphic);
    } else {
      // must be at beginning, get the first note
      const firstLine = first(this.score.lines);
      const firstMeasure = firstLine && first(firstLine.measures);
      startNote = (firstMeasure && first(firstMeasure.notes)) || null;

      if (!startNote) {
        throw new Error('no first note for x pos');
      }

      x0 = this.getX(startNote.graphic);
    }

    // Compute x1
    let x1: number;
    if (stopNote) {
      const shouldUseSvgWidth: boolean = (
        (stopNote.measure!.line !== get(startNote, 'measure.line')) ||
        (stopNote.isLast && get(stopNote.measure, 'isLast', false))
      );

      if (shouldUseSvgWidth) {
        x1 = this.svgWidth;
      } else {
        x1 = this.getX(stopNote.graphic);
      }
    } else {
      // must be at the end, use the svg width
      x1 = this.svgWidth;
    }

    return interpolate({ x: t0, y: x0 }, { x: t1, y: x1 }, this.tick);
  }

  public get y(): number {
    let line;
    if (this.spec.start.note) {
      line = get(this.spec.start.note, 'measure.line');
    } else {
      // if you have no start note, you are at the beginning, so use the first line
      line = first(this.score.lines);
    }

    if (!line) {
      throw new Error('could not find line for y computation');
    }

    return line.graphic.getBBox().y;
  }

  private get svgWidth(): number {
    return this.score.svg.getBBox().width;
  }

  private getX(graphic: any): number {
    const bbox = graphic.getBBox();
    return bbox.x + bbox.width;
  }
}
