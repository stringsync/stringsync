import * as React from 'react';
import { compose } from 'recompose';
import { Measure as MeasureModel, Scale, Key, Note } from 'models';
import { Form, InputNumber, Select, Divider } from 'antd';
import styled from 'react-emotion';
import { uniq, flatMap } from 'lodash';
import { withVextabChangeHandlers } from 'enhancers';
import { SelectValue } from 'antd/lib/select';

const { Option } = Select;

const NOTES = flatMap(Scale.for('A', 'chromatic').notes(), note => (
  uniq([note.toFlat().literal, note.toSharp().literal])
));

interface IOuterProps {
  element: MeasureModel;
}

interface IVextabChangeHandlerProps extends IOuterProps {
  handleKeyChange: (value: SelectValue) => void;
  handleUpperChange: (value: number | string) => void;
  handleLowerChange: (value: number | string) => void;
}

const enhance = compose<IVextabChangeHandlerProps, IOuterProps>(
  withVextabChangeHandlers<number | string, IOuterProps>({
    handleKeyChange: props => (noteLiteral: string, vextab) => {
      const measure = vextab.measures.find($measure => $measure.index === props.element.index);

      if (!measure) {
        return;
      }

      const note = new Note(noteLiteral, 0);
      const key = new Key(note);
      measure.bar.key = key;

      return vextab;
    },
    handleLowerChange: props => (value: number | string, vextab) => {
      const measure = vextab.measures.find($measure => $measure.index === props.element.index);

      if (!measure) {
        return;
      }

      const lower = typeof value === 'number' ? value : parseInt(value, 10);
      measure.bar.timeSignature.lower = lower;

      return vextab;
    },
    handleUpperChange: props => (value: number | string, vextab) => {
      const measure = vextab.measures.find($measure => $measure.index === props.element.index);

      if (!measure) {
        return;
      }

      const upper = typeof value === 'number' ? value : parseInt(value, 10);
      measure.bar.timeSignature.upper = upper;

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
      <InputNumber disabled={true} defaultValue={props.element.index} />
    </Form.Item>
    <Form.Item label="length">
      <InputNumber disabled={true} value={props.element.elements.length} />
    </Form.Item>
    <Form.Item label="key">
      <StyledSelect
        onChange={props.handleKeyChange}
        defaultValue={props.element.bar.key.note.literal}
      >
        {NOTES.map(note => <Option key={note}>{note}</Option>)}
      </StyledSelect>
    </Form.Item>
    <Form.Item label="time signature">
      <InputNumber
        onChange={props.handleUpperChange}
        defaultValue={props.element.bar.timeSignature.upper}
      />
      <Divider type="vertical" />
      <InputNumber
        onChange={props.handleLowerChange}
        defaultValue={props.element.bar.timeSignature.lower}
      />
    </Form.Item>
  </Form>
));
