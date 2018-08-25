import * as React from 'react';
import { compose } from 'recompose';
import { Measure as MeasureModel, Scale } from 'models';
import { Form, InputNumber, Select, Divider, Input } from 'antd';
import styled from 'react-emotion';
import { uniq, flatMap } from 'lodash';
import { withVextabChangeHandlers } from 'enhancers';

const { Option } = Select;

const NOTES = flatMap(Scale.for('A', 'chromatic').notes(), note => (
  uniq([note.toFlat().literal, note.toSharp().literal])
));

interface IOuterProps {
  element: MeasureModel;
}

interface IVextabChangeHandlerProps extends IOuterProps {
  handleUpperChange: (value: number | string) => void;
}

const enhance = compose<IVextabChangeHandlerProps, IOuterProps>(
  withVextabChangeHandlers<number | string, IOuterProps>({
    handleUpperChange: props => (value, vextab) => {
      const measure = vextab.measures.find($measure => $measure.id === props.element.id);

      if (!measure) {
        return;
      }

      const upper = typeof value === 'number' ? value : parseInt(value, 10);
      measure.spec.timeSignature.upper = upper;

      return vextab;
    }
  })
);

const StyledSelect = styled(Select)`
  .ant-select-selection {
    min-width: 5em;
  }
`;

export const Measure = enhance(props => (
  <Form layout="inline">
    <Form.Item label="id">
      <InputNumber disabled={true} defaultValue={props.element.id} />
    </Form.Item>
    <Form.Item label="length">
      <InputNumber disabled={true} value={props.element.elements.length} />
    </Form.Item>
    <Form.Item label="key">
      <StyledSelect value={props.element.spec.key.note.literal}>
        {NOTES.map(note => <Option key={note}>{note}</Option>)}
      </StyledSelect>
    </Form.Item>
    <Form.Item label="time signature">
      <InputNumber 
        onChange={props.handleUpperChange}
        defaultValue={props.element.spec.timeSignature.upper}
      />
      <Divider type="vertical" />
      <InputNumber value={props.element.spec.timeSignature.lower} />
    </Form.Item>
  </Form>
));
