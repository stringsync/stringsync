import * as React from 'react';
import { compose } from 'recompose';
import { Form, Input, Checkbox } from 'antd';
import { Rhythm as RhythmModel } from 'models';
import { Tuplet } from './Tuplet';

interface IOuterProps {
  element: RhythmModel;
}

const enhance = compose<IOuterProps, IOuterProps>(

);

export const Rhythm = enhance(props => (
  <Form.Item>
    <Form.Item label="rhythm value">
      <Input value={props.element.value} />
    </Form.Item>
    <Form.Item label="dot">
      <Checkbox checked={props.element.dot} />
    </Form.Item>
    {props.element.tuplet ? <Tuplet element={props.element.tuplet} /> : null}
  </Form.Item>
));
