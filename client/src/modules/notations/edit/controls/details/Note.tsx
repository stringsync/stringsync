import * as React from 'react';
import { compose } from 'recompose';
import { Form, InputNumber } from 'antd';
import { Note as NoteModel } from 'models';
import { Rhythm } from './Rhythm';
import { Tuplet } from './Tuplet';

interface IOuterProps {
  element: NoteModel;
}

const enhance = compose<IOuterProps, IOuterProps>(

);

export const Note = enhance(props => (
  <Form.Item>
    <Form.Item label="id">
      <InputNumber disabled={true} value={props.element.id} />
    </Form.Item>
    <Form.Item label="fret">
      <InputNumber value={props.element.positions[0].fret} />
    </Form.Item>
    <Form.Item label="string">
      <InputNumber value={props.element.positions[0].str} />
    </Form.Item>
    {props.element.rhythm ? <Rhythm element={props.element.rhythm} /> : null}
  </Form.Item>
));
