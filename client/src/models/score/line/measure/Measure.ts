import { Note } from './note';
import { Line } from '../Line';
import { first, get, last } from 'lodash';

export class Measure {
  public notes: Note[] = [];
  public line: Line | undefined;
  public prev: Measure | undefined | null;
  public next: Measure | undefined | null;

  public get isFirst(): boolean {
    return first(get(this.line, 'measures', [])) === this;
  }

  public get isLast(): boolean {
    return last(get(this.line, 'measures', [])) === this;
  }

  constructor(notes: Note[]) {
    this.notes = notes;
  }
}
