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

  public light(): void {
    const paths = this.graphic.querySelectorAll('path');
    paths.forEach(path => {
      path.setAttribute('stroke', 'red');
      path.setAttribute('fill', 'red');
    });
  }

  public unlight(): void {
    const paths = this.graphic.querySelectorAll('path');
    paths.forEach(path => {
      path.setAttribute('stroke', 'black');
      path.setAttribute('fill', 'black');
    });
  }
}
