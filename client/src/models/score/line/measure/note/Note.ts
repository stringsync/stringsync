import { Measure } from '../Measure';
import { first, get, last } from 'lodash';
export class Note {
  public static isBar(noteNote: any): boolean {
    return noteNote.duration.toLowerCase() === 'b';
  }

  public readonly graphic: any;

  public measure: Measure | undefined;

  // Callers should not access the vexflow elements. Instead,
  // a method exposing and computing some aspect of the vexflow
  // element should be created.
  private readonly noteNote: any;
  private readonly tabNote: any;

  constructor(noteNote: any, tabNote: any, graphic: any) {
    this.noteNote = noteNote;
    this.tabNote = tabNote;
    this.graphic = graphic;
  }

  get durationTick(): number {
    return this.noteNote.getTicks().simplify().value();
  }

  public get isFirst(): boolean {
    return first(get(this.measure, 'notes', [])) === this;
  }

  public get isLast(): boolean {
    return last(get(this.measure, 'notes', [])) === this;
  }

  public get next(): Note | null {
    if (!this.measure) {
      return null;
    }

    if (this.isLast) {
      const nextMeasure = this.measure.next;
      if (!nextMeasure) {
        return null;
      }

      return first(nextMeasure.notes) || null;
    }

    const ndx = this.measure.notes.indexOf(this);

    if (ndx < 0) {
      return null;
    }

    return this.measure.notes[ndx + 1] || null;
  }

  public get prev(): Note | null {
    if (!this.measure) {
      return null;
    }

    if (this.isFirst) {
      const prevMeasure = this.measure.prev;
      if (!prevMeasure) {
        return null;
      }

      return last(prevMeasure.notes) || null;
    }

    const ndx = this.measure.notes.indexOf(this);

    if (ndx < 0) {
      return null;
    }

    return this.measure.notes[ndx - 1] || null;
  }

  public light(): void {
    this.setColor('red');
  }

  public unlight(): void {
    this.setColor('black');
  }

  private setColor(color: string): void {
    const paths = this.graphic.querySelectorAll('.vf-notehead path');
    paths.forEach(path => {
      path.setAttribute('stroke', color);
      path.setAttribute('fill', color);
    });
  }
}
