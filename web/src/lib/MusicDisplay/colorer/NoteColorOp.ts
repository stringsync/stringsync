import $ from 'jquery';
import { get } from 'lodash';
import { EngravingRules, GraphicalNote, Note } from 'opensheetmusicdisplay';
import { CursorSnapshot } from '../locator';
import { ColorOp } from './types';

const DEFAULT_COLOR = '#000000';

export class NoteColorOp implements ColorOp {
  static init(cursorSnapshot: CursorSnapshot) {
    const notes = cursorSnapshot.getNotes();
    const tabNotes = cursorSnapshot.getTabNotes();
    const targetNotes = [...notes, ...tabNotes];
    const graceNotes = cursorSnapshot.getGraceNotes();
    const rules = cursorSnapshot.getIteratorSnapshot().clone().CurrentMeasure.Rules;
    return new NoteColorOp(targetNotes, graceNotes, rules);
  }

  private notes: Note[];
  private graceNotes: Note[];
  private rules: EngravingRules;
  private prevColorByNote = new Map<Note, string>();

  constructor(notes: Note[], graceNotes: Note[], rules: EngravingRules) {
    this.notes = notes;
    this.graceNotes = graceNotes;
    this.rules = rules;
  }

  perform(color: string) {
    for (const note of this.notes) {
      this.prevColorByNote.set(note, note.NoteheadColorCurrentlyRendered);
      const graphicalNote = GraphicalNote.FromNote(note, this.rules);
      this.renderColor(color, graphicalNote);
    }
    for (const note of this.graceNotes) {
      const graphicalNote = GraphicalNote.FromNote(note, this.rules);
      this.renderColor(note.NoteheadColorCurrentlyRendered, graphicalNote);
    }
  }

  undo() {
    for (const note of this.notes) {
      const graphicalNote = GraphicalNote.FromNote(note, this.rules);
      const prevColor = this.prevColorByNote.get(note) || DEFAULT_COLOR;
      this.renderColor(prevColor, graphicalNote);
    }
    this.prevColorByNote = new Map();
  }

  private renderColor(color: string, graphicalNote: GraphicalNote) {
    const $el = this.getTargetElements(graphicalNote);
    if ($el) {
      $el.attr({ fill: color, stroke: color });
    }
  }

  private getTargetElements(graphicalNote: GraphicalNote): JQuery<SVGPathElement> | null {
    const el = get(graphicalNote, 'vfnote[0].attrs.el', null);
    if (!el) {
      return null;
    }

    return $(el).find('path');
  }
}
