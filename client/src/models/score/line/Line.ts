import { Measure } from './measure';
import { last } from 'lodash';
import { Note } from './measure/note/Note';

export class Line {
  public readonly stave: any;

  public measures: Measure[] = [];

  constructor(stave: any) {
    this.stave = stave;

    this.measures = this.getMeasures();
  }

  private getMeasures(): Measure[] {
    const noteNotes: any[] = this.stave.note_notes;
    const tabNotes: any[] = this.stave.tab_notes;

    if (noteNotes.length !== tabNotes.length) {
      throw new Error('expected note_notes and tab_notes lengths to be the same');
    }

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

      group.push(new Note(noteNote, tabNotes[ndx]));

      return groups;
    }, [] as Note[]);

    return noteGroups.map(notes => new Measure(notes));
  }
}
