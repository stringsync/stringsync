import { Measure } from './measure';
import { first, last, get } from 'lodash';
import { Note } from './measure/note/Note';
import { SVGExtractor } from '../SVGExtractor';
import { Score } from '../Score';

export class Line {
  public readonly stave: any;
  public readonly index: number;

  public graphic: any;
  public measures: Measure[] = [];
  public score: Score | undefined;

  constructor(stave: any, index: number) {
    this.stave = stave;
    this.index = index;
  }

  public get isFirst(): boolean {
    return first(get(this.score, 'lines', [])) === this;
  }

  public get isLast(): boolean {
    return last(get(this.score, 'lines', [])) === this;
  }

  public get next(): Line | null {
    if (!this.score) {
      return null;
    }

    const ndx = this.score.lines.indexOf(this);

    if (ndx < 0) {
      return null;
    }

    return this.score.lines[ndx + 1] || null;
  }

  public get prev(): Line | null {
    if (!this.score) {
      return null;
    }

    const ndx = this.score.lines.indexOf(this);

    if (ndx < 0) {
      return null;
    }

    return this.score.lines[ndx - 1] || null;
  }

  public hydrate(extractor: SVGExtractor, noteOffset: number): Measure[] {
    this.graphic = extractor.getStaveLine(this.index);

    const noteNotes: any[] = this.stave.note_notes;
    const tabNotes: any[] = this.stave.tab_notes;

    const expectedNumNoteGraphics = noteNotes.filter(noteNote => !Note.isBar(noteNote)).length;
    const noteGraphics = extractor.getStaveNotes(noteOffset, noteOffset + expectedNumNoteGraphics);

    if (noteNotes.length !== tabNotes.length) {
      throw new Error('expected note_notes and tab_notes to be the same length');
    }

    // Create elementary versions of measures
    let noteGraphicNdx = 0;
    const noteGroups = noteNotes.reduce((groups, noteNote, ndx) => {
      if (Note.isBar(noteNote)) {
        // new measure
        groups.push([]);
        return groups;
      }

      const group = last<Note[]>(groups);
      if (!group) {
        throw new Error('expected a group to compute measures');
      }

      const noteGraphic = noteGraphics[noteGraphicNdx++];
      group.push(new Note(noteNote, tabNotes[ndx], noteGraphic));

      return groups;
    }, [] as Note[]);

    // Create the measure
    return this.measures = noteGroups.map(notes => new Measure(notes));
  }
}
