import * as React from 'react';
import { compose, withProps } from 'recompose';
import { Form, InputNumber } from 'antd';
import { Note as NoteModel, Chord as ChordModel } from 'models';
import { Rhythm } from './Rhythm';
import { Position } from './Position';

interface IOuterProps {
  element: NoteModel | ChordModel;
  editor: Store.IEditorState;
}

interface IFretsByStringsProps extends IOuterProps {
  fretsByStrings: {
    [key: number]: number;
  }
}

const enhance = compose<IFretsByStringsProps, IOuterProps>(
  withProps((props: IOuterProps) => ({
    fretsByStrings: props.element.positions.reduce((memo, pos) => {
      memo[pos.str] = pos.fret;
      return memo
    }, {})
  }))
);

export const ChordOrNote = enhance(props => (
  <div>
    <Form layout="inline">
      <Form.Item label="id">
        <InputNumber disabled={true} value={props.element.id} />
      </Form.Item>
      <div>
        {
          [1, 2, 3, 4, 5, 6].map(str => (
            <Position 
              key={`note-${props.editor.elementIndex}-${str}`}
              element={props.element}
              editor={props.editor}
              position={{ str, fret: props.fretsByStrings[str] }}
            />
          ))
        }
      </div>
    </Form>
    {props.element.rhythm ? <Rhythm editor={props.editor} element={props.element.rhythm} /> : null}
  </div>
));
