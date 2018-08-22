import * as React from 'react';
import { compose } from 'recompose';
import { Form, InputNumber } from 'antd';
import { Note as NoteModel } from 'models';
import { Rhythm } from './Rhythm';

interface IOuterProps {
  element: NoteModel;
}

const enhance = compose<IOuterProps, IOuterProps>(

);

export const Chord = enhance(props => (
  <Form.Item>
    <Form.Item label="id">
      <InputNumber disabled={true} value={props.element.id} />
    </Form.Item>
    {
      props.element.positions.map(position => (
        <Form.Item key={`chord-id-${props.element.id}-${position.fret}-${position.str}`}>
          <Form.Item label="fret">
            <InputNumber value={position.fret} />
          </Form.Item>
          <Form.Item label="string">
            <InputNumber value={position.str} />
          </Form.Item>
        </Form.Item>
      ))
    }
    {props.element.rhythm ? <Rhythm element={props.element.rhythm} /> : null}
  </Form.Item>
));
