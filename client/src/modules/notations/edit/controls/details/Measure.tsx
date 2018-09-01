import * as React from 'react';
import { compose } from 'recompose';
import { Measure as MeasureModel, Scale, Key, Note } from 'models';
import { Form, InputNumber, Select, Divider } from 'antd';
import styled from 'react-emotion';
import { uniq, flatMap } from 'lodash';
import { withEditorHandlers } from 'enhancers';
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
  withEditorHandlers<number | string, IOuterProps>({
    handleKeyChange: () => (noteLiteral: string, editor) => {
      editor.updateMeasureKey(noteLiteral);
    },
    handleLowerChange: () => (value: number | string, editor) => {
      const { measure } = editor;

      if (!measure) {
        return;
      }

      const lower = typeof value === 'number' ? value : parseInt(value, 10);
      const { upper } = measure.bar.timeSignature;

      editor.updateTimeSignature(upper, lower);
    },
    handleUpperChange: () => (value: number | string, editor) => {
      const { measure } = editor;

      if (!measure) {
        return;
      }

      const upper = typeof value === 'number' ? value : parseInt(value, 10);
      const { lower } = measure.bar.timeSignature;

      editor.updateTimeSignature(upper, lower);
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
