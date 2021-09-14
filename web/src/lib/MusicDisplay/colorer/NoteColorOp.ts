import $ from 'jquery';
import { get } from 'lodash';
import { Cursor, EngravingRules, GraphicalNote, Note } from 'opensheetmusicdisplay';
import { ColorOp } from './types';

const DEFAULT_COLOR = '#000000';

export class NoteColorOp implements ColorOp {
  static init(cursor: Cursor) {
    const notes = cursor.NotesUnderCursor();
    const rules = cursor.iterator.CurrentMeasure.Rules;
    return new NoteColorOp(notes, rules);
  }

  private notes: Note[];
  private rules: EngravingRules;
  private prevColorByNote = new Map<Note, string>();

  constructor(notes: Note[], rules: EngravingRules) {
    this.notes = notes;
    this.rules = rules;
  }

  perform(color: string) {
    for (const note of this.notes) {
      this.prevColorByNote.set(note, note.NoteheadColorCurrentlyRendered);
      const graphicalNote = GraphicalNote.FromNote(note, this.rules);
      this.renderColor(color, graphicalNote);
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
    const $el = this.getNoteHeadElement(graphicalNote);
    if ($el) {
      $el.attr({ fill: color, stroke: color });
    }
  }

  private getNoteHeadElement(graphicalNote: GraphicalNote): JQuery<HTMLElement> | null {
    const el = get(graphicalNote, 'vfnote[0].attrs.el', null);
    if (!el) {
      return null;
    }

    return $(el).find('.vf-notehead > path');
  }
}
