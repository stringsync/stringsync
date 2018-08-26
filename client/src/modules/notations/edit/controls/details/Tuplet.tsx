import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import { Form, InputNumber } from 'antd';
import { Tuplet as TupletModel } from 'models';

interface IOuterProps {
  tuplet: TupletModel | null;
}

const enhance = compose<IOuterProps, IOuterProps>(
  branch((props: IOuterProps) => !props.tuplet, renderNothing)
);

export const Tuplet = enhance(props => (
  <Form.Item label="tuplet value">
    <InputNumber defaultValue={props.tuplet!.value} />
  </Form.Item>
));
