import * as React from 'react';
import { compose } from 'recompose';
import styled from 'react-emotion';
import { InputNumber, Form, Input } from 'antd';

const enhance = compose(
);

const Outer = styled('div')`
  margin: 24px;
  padding-bottom: 72px;
`;

export const Editor = enhance(props => (
  <Outer>
    <Form>
      <Form.Item label="dead time (ms)">
        <InputNumber />
      </Form.Item>
      <Form.Item label="bpm">
        <InputNumber />
      </Form.Item>
      <Form.Item label="vextab string">
        <Input.TextArea autosize={{ minRows: 5 }} />
      </Form.Item>
    </Form>
  </Outer>
));
