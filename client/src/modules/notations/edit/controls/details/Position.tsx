import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Form, Input, InputNumber } from 'antd';
import { Chord, Note, Measure } from 'models';
import { withVextab, IWithVextabProps } from 'enhancers';
import { get } from 'lodash';

interface IOuterProps {
  element: Chord | Note;
  editor: Store.IEditorState;
  position: Guitar.IPosition;
}

type VextabProps = IOuterProps & IWithVextabProps;

interface IHandlerProps extends VextabProps {
  handleFretChange: (fret: number | string) => void;
}

const enhance = compose<IHandlerProps, IOuterProps>(
  withVextab,
  withHandlers({
    handleFretChange: (props: VextabProps) => (value: number | string) => {
      let nextFret: number | undefined = typeof value === 'number' ? value : parseInt(value, 10);
      nextFret = isNaN(nextFret) ? undefined : nextFret;

      const vextab = props.getVextab();

      const note = vextab.elements[props.editor.elementIndex] as Note | Chord;
      const { str, fret } = props.position;
      const position = note.positions.find(pos => pos.str === str);

      if (typeof fret === 'undefined' && fret === nextFret) {
        // No changes were made
        return;
      }

      if (typeof nextFret === 'undefined') {
        // undefined fret might mean remove a note
        if (note.type === 'NOTE') {
          note.positions = note.positions.filter(pos => pos.str === str);
        } else if (note.notes.length === 2) {
          // transform from a chord to a note
          const remainingNote = note.notes.find(chordNote => (
            chordNote.positions.some(pos => pos.str !== str))
          ) as Note;

          const measure = note.measure as Measure;
          const ndx = measure.elements.indexOf(note);
          measure.elements.splice(ndx, 1, remainingNote);
        } else {
          // filter the note corresponding to the str out of the notes
          note.notes = note.notes.filter(chordNote => (
            chordNote.positions.some(pos => pos.str !== str))
          );
        }
      } else {
        // we are adding or changing the note/chord
        if (position) {
          position.fret = nextFret;
        } else {
          const newNote = Note.from(vextab.tuning.getNoteForFret(`${nextFret}`, `${str}`));
          newNote.positions.push({ str, fret: nextFret });

          // Hacky/elegant way to handle a Chord or Note type
          const chordNotes = get(note, 'notes', [note]);
          const chord = new Chord([...chordNotes, newNote]);

          const measure = note.measure as Measure;
          const ndx = measure.elements.indexOf(note);
          measure.elements.splice(ndx, 1, chord);
        }
      }
      
      props.setVextab(vextab);
    }
  })
);

export const Position = enhance(props => (
  <Form.Item label="position">
    <Input.Group compact={true}>
      <InputNumber disabled={true} value={props.position.str} />
      <InputNumber
        min={0}
        max={30}
        defaultValue={props.position.fret}
        onChange={props.handleFretChange}
      />
    </Input.Group>
  </Form.Item>
));
