import $ from 'jquery';
import { get } from 'lodash';
import { Cursor, EngravingRules, GraphicalNote, Note } from 'opensheetmusicdisplay';
import { theme } from '../../theme';

export class ColoringOperation {
  static init(cursor: Cursor) {
    const notes = cursor.NotesUnderCursor();
    const rules = cursor.iterator.CurrentMeasure.Rules;
    return new ColoringOperation(notes, rules);
  }

  private notes: Note[];
  private rules: EngravingRules;

  constructor(notes: Note[], rules: EngravingRules) {
    this.notes = notes;
    this.rules = rules;
  }

  perform() {
    for (const note of this.notes) {
      const graphicalNote = GraphicalNote.FromNote(note, this.rules);
      this.renderColor(theme['@primary-color'], graphicalNote);
    }
  }

  restore() {
    for (const note of this.notes) {
      const graphicalNote = GraphicalNote.FromNote(note, this.rules);
      this.renderColor(note.NoteheadColorCurrentlyRendered, graphicalNote);
    }
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
