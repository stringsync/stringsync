import { Note } from './note';
import { Line } from '../Line';
import { first, get, last } from 'lodash';

export class Measure {
  public notes: Note[] = [];
  public line: Line | undefined;

  public get isFirst(): boolean {
    return first(get(this.line, 'measures', [])) === this;
  }

  public get isLast(): boolean {
    return last(get(this.line, 'measures', [])) === this;
  }

  public get next(): Measure | null {
    if (!this.line) {
      return null;
    }

    if (this.isLast) {
      const nextLine = this.line.next;
      if (!nextLine) {
        return null;
      }

      return first(nextLine.measures) || null;
    }

    const ndx = this.line.measures.indexOf(this);

    if (ndx < 0) {
      return null;
    }

    return this.line.measures[ndx + 1] || null;
  }

  public get prev(): Measure | null {
    if (!this.line) {
      return null;
    }

    if (this.isFirst) {
      const prevLine = this.line.prev;
      if (!prevLine) {
        return null;
      }

      return last(prevLine.measures) || null;
    }

    const ndx = this.line.measures.indexOf(this);

    if (ndx < 0) {
      return null;
    }

    return this.line.measures[ndx - 1] || null;
  }

  constructor(notes: Note[]) {
    this.notes = notes;
  }
}
