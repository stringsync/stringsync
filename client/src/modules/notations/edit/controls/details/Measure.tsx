import * as React from 'react';
import { compose } from 'recompose';
import { Measure as MeasureModel, Scale } from 'models';
import { Form, InputNumber, Select, Divider } from 'antd';
import styled from 'react-emotion';
import { uniq, flatMap } from 'lodash';

const { Option } = Select;

const NOTES = flatMap(Scale.for('A', 'chromatic').notes(), note => (
  uniq([note.toFlat().literal, note.toSharp().literal])
));

interface IOuterProps {
  element: MeasureModel;
}

const enhance = compose<IOuterProps, IOuterProps>(

);

const StyledSelect = styled(Select)`
  .ant-select-selection {
    min-width: 5em;
  }
`;

export const Measure = enhance(props => (
  <Form.Item>
    <Form.Item label="id" colon={false}>
      <InputNumber disabled={true} value={props.element.id} />
    </Form.Item>
    <Form.Item label="length" colon={false}>
      <InputNumber disabled={true} value={props.element.elements.length} />
    </Form.Item>
    <Form.Item label="key" colon={false}>
      <StyledSelect value={props.element.spec.key.note.literal}>
        {NOTES.map(note => <Option key={note}>{note}</Option>)}
      </StyledSelect>
    </Form.Item>
    <Form.Item label="time signature" colon={false}>
      <InputNumber value={props.element.spec.timeSignature.upper} />
      <Divider type="vertical" />
      <InputNumber value={props.element.spec.timeSignature.lower} />
    </Form.Item>
  </Form.Item>
));
