import * as React from 'react';
import { compose } from 'recompose';
import { Bar as BarModel } from 'models';
import { Form, Select, InputNumber } from 'antd';

const { Option } = Select;

interface IOuterProps {
  element: BarModel;
}

const enhance = compose<IOuterProps, IOuterProps>(

);

export const Bar = enhance(props => (
  <Form.Item>
    <Form.Item label="id">
      <InputNumber disabled={true} value={props.element.id} />
    </Form.Item>
    <Form.Item label="kind">
      <Select value={props.element.kind}>
        {BarModel.KINDS.map(kind => <Option key={kind}>{kind}</Option>)}
      </Select>
    </Form.Item>  
  </Form.Item>
));
