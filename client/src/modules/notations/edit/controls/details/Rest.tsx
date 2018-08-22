import * as React from 'react';
import { compose } from 'recompose';
import { Form, InputNumber } from 'antd';
import { Rest as RestModel } from 'models';
import { Rhythm } from './Rhythm';

interface IOuterProps {
  element: RestModel;
}

const enhance = compose<IOuterProps, IOuterProps>(

);

export const Rest = enhance(props => (
  <Form.Item>
    <Form.Item label="id">
      <InputNumber disabled={true} value={props.element.id} />
    </Form.Item>
    <Form.Item label="position">
      <InputNumber value={props.element.position} />
    </Form.Item>
    <Rhythm element={props.element.rhythm} />
  </Form.Item>
));
