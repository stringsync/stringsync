import * as React from 'react';
import { compose } from 'recompose';
import { Form, InputNumber } from 'antd';
import { Tuplet as TupletModel } from 'models';

interface IOuterProps {
  element: TupletModel;
}

const enhance = compose<IOuterProps, IOuterProps>(

);

export const Tuplet = enhance(props => (
  <Form.Item label="tuplet value">
    <InputNumber value={props.element.value} />
  </Form.Item>
));
